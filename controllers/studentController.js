const { User, Student, Role, Class, Parent, StudentParent, Grade, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { sendEmail } = require("../utils/email");

const createStudent = async (req, res) => {
  const transaction = await sequelize.transaction(); // Открываем транзакцию
  try {
    // Добавляем логирование для отладки
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const {
      email,
      password,
      firstName,
      lastName,
      middleName,
      gender,
      login,
      idRole,
      idClass,
      phone,
      birthDate,
      documentNumber,
      bloodGroup,
    } = req.body;

    // Преобразуем строковые значения в нужные типы
    const parsedIdRole = parseInt(idRole, 10);
    const parsedIdClass = parseInt(idClass, 10);
    const parsedBloodGroup = parseInt(bloodGroup, 10);

    // Проверка обязательных полей
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !gender ||
      !login ||
      !idRole ||
      !idClass ||
      !phone ||
      !birthDate ||
      !documentNumber ||
      !bloodGroup
    ) {
      // Логируем отсутствующие поля для отладки
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!firstName) missingFields.push('firstName');
      if (!lastName) missingFields.push('lastName');
      if (!gender) missingFields.push('gender');
      if (!login) missingFields.push('login');
      if (!idRole) missingFields.push('idRole');
      if (!idClass) missingFields.push('idClass');
      if (!phone) missingFields.push('phone');
      if (!birthDate) missingFields.push('birthDate');
      if (!documentNumber) missingFields.push('documentNumber');
      if (!bloodGroup) missingFields.push('bloodGroup');
      
      console.log("Missing fields:", missingFields);
      
      return res.status(400).json({ 
        message: "All required fields must be provided",
        missingFields: missingFields
      });
    }

    // Проверка уникальности email и логина
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { login }] },
      transaction
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or login already exists" });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Получаем путь к загруженной фотографии, если она есть
    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/userPhotos/${req.file.filename}`;
    }

    // Создание пользователя в транзакции
    const user = await User.create(
      {
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName || null,
        gender,
        login,
        id_role: parsedIdRole,
        photo: photoPath,
      },
      { transaction }
    );

    // Создание студента в транзакции
    const student = await Student.create(
      {
        id_user: user.id_user,
        id_class: parsedIdClass,
        phone,
        birth_date: birthDate,
        document_number: documentNumber,
        blood_group: parsedBloodGroup,
      },
      { transaction }
    );

    // Отправка письма с логином и паролем
    const emailText = `Здравствуйте, ${firstName} ${lastName}!\n\nВаши данные для входа в систему:\nЛогин: ${login}\nПароль: ${password}\n\nС уважением,\nАдминистрация школы`;
    sendEmail(email, 'Регистрация в системе', emailText);

    // Фиксируем изменения в базе
    await transaction.commit();

    const role = await Role.findByPk(user.id_role);
    const roleName = role ? role.name : null;

    const classInfo = await Class.findByPk(student.id_class);

    // Формируем полный URL для фото
    const photoUrl = photoPath ? `${req.protocol}://${req.get("host")}${photoPath}` : null;

    return res.json({
      message: "Student created successfully",
      user: {
        id: user.id_user,
        email: user.email,
        login: user.login,
        idStudent: student.id_student,
        idClass: student.id_class,
        className: classInfo ? `${classInfo.class_number}${classInfo.class_letter}` : null,
        role: {
          idRole: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        photo: photoUrl,
        phone: student.phone,
        birthDate: student.birth_date,
        documentNumber: student.document_number,
        bloodGroup: student.blood_group,
      },
    });
  } catch (e) {
    console.error("Error creating student:", e);
    
    if (!transaction.finished) {
      await transaction.rollback(); // Откатить изменения в случае ошибки
    }
    
    // Удаляем загруженный файл в случае ошибки
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }
    
    res.status(500).json({ message: "Error creating student", error: e.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: User,
          attributes: ["login", "email", "first_name", "last_name", "middle_name", "gender", "photo"],
        },
        {
          model: Class,
          attributes: ["class_number", "class_letter"],
        },
      ],
    });

    const studentsWithClassInfo = await Promise.all(students.map(async (student) => {
      const parentRecords = await StudentParent.findAll({
        where: { id_student: student.id_student },
        include: {
          model: Parent,
          include: {
            model: User,
            attributes: ["first_name", "last_name", "middle_name"]
          }
        }
      });

      const parents = parentRecords.map(record => ({
        idParent: record.Parent.id_parent,
        firstName: record.Parent.User.first_name,
        lastName: record.Parent.User.last_name,
        middleName: record.Parent.User.middle_name
      }));

      const photoUrl = student.User.photo ? `${req.protocol}://${req.get("host")}${student.User.photo}` : null;

      return {
        student: {
          idStudent: student.id_student,
          firstName: student.User.first_name,
          lastName: student.User.last_name,
          middleName: student.User.middle_name,
          phone: student.phone,
          birthDate: student.birth_date,
          login: student.User.login,
          email: student.User.email,
          gender: student.User.gender,
          photo: photoUrl,
          documentNumber: student.document_number,
          bloodGroup: student.blood_group,
        },
        class: {
          idClass: student.id_class,
          classNumber: student.Class ? student.Class.class_number : null,
          classLetter: student.Class ? student.Class.class_letter : null
        },
        parents: parents
      };
    }));

    res.json(studentsWithClassInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const getStudentsByClass = async (req, res) => {
  const { idClass } = req.params;

  try {
    const students = await Student.findAll({
      where: { id_class: idClass },
      include: [
        {
          model: User,
          attributes: ["login", "email", "first_name", "last_name", "middle_name", "gender", "photo"],
        },
        {
          model: Class,
          attributes: ["class_number", "class_letter"],
        },
      ],
    });

    const studentsWithClassInfo = await Promise.all(students.map(async (student) => {
      const parentRecords = await StudentParent.findAll({
        where: { id_student: student.id_student },
        include: {
          model: Parent,
          include: {
            model: User,
            attributes: ["first_name", "last_name", "middle_name"]
          }
        }
      });

      const parents = parentRecords.map(record => ({
        idParent: record.Parent.id_parent,
        firstName: record.Parent.User.first_name,
        lastName: record.Parent.User.last_name,
        middleName: record.Parent.User.middle_name
      }));

      const photoUrl = student.User.photo ? `${req.protocol}://${req.get("host")}${student.User.photo}` : null;

      return {
        student: {
          idStudent: student.id_student,
          firstName: student.User.first_name,
          lastName: student.User.last_name,
          middleName: student.User.middle_name,
          phone: student.phone,
          birthDate: student.birth_date,
          login: student.User.login,
          email: student.User.email,
          gender: student.User.gender,
          photo: photoUrl,
          documentNumber: student.document_number,
          bloodGroup: student.blood_group,
        },
        class: {
          idClass: student.id_class,
          classNumber: student.Class ? student.Class.class_number : null,
          classLetter: student.Class ? student.Class.class_letter : null
        },
        parents: parents
      };
    }));

    res.json(studentsWithClassInfo);
  } catch (error) {
    console.error("Error fetching students by class:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

const getStudentById = async (req, res) => {
  const { idStudent } = req.params;

  try {
    const student = await Student.findOne({
      where: { id_student: idStudent },
      include: [
        {
          model: User,
          attributes: ["login", "email", "first_name", "last_name", "middle_name", "gender", "photo"],
        },
        {
          model: Class,
          attributes: ["id_class","class_number", "class_letter"],
        },
        {
          model: Grade,
          attributes: ["grade_value"],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Студент не найден" });
    }

    const parentRecords = await StudentParent.findAll({
      where: { id_student: student.id_student },
      include: {
        model: Parent,
        include: {
          model: User,
          attributes: ["first_name", "last_name", "middle_name"]
        }
      }
    });

    const parents = parentRecords.map(record => ({
      idParent: record.Parent.id_parent,
      firstName: record.Parent.User.first_name,
      lastName: record.Parent.User.last_name,
      middleName: record.Parent.User.middle_name
    }));

    const grades = student.Grades.map((grade) => grade.grade_value);

    const distribution = grades.reduce((acc, grade) => {
      if (grade >= 2 && grade <= 5) {
        acc[grade] = (acc[grade] || 0) + 1;
      }
      return acc;
    }, { 2: 0, 3: 0, 4: 0, 5: 0 });

    const photoUrl = student.User.photo ? `${req.protocol}://${req.get("host")}${student.User.photo}` : null;


    const studentWithClassInfo = {
      student: {
        idStudent: student.id_student,
        firstName: student.User.first_name,
        lastName: student.User.last_name,
        middleName: student.User.middle_name,
        phone: student.phone,
        birthDate: student.birth_date,
        login: student.User.login,
        email: student.User.email,
        gender: student.User.gender,
        photo: photoUrl,
        documentNumber: student.document_number,
        bloodGroup: student.blood_group,
      },
      class: {
        idClass: student.id_class,
        classNumber: student.Class ? student.Class.class_number : null,
        classLetter: student.Class ? student.Class.class_letter : null
      },
      parents: parents,
      distribution: distribution
    };

    res.json(studentWithClassInfo);
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

const getStydentsByParentId = async (req, res) => {
  const { idParent } = req.params;

  try {
    // Find all student-parent relationships for this parent
    const studentParentRecords = await StudentParent.findAll({
      where: { id_parent: idParent }
    });

    if (!studentParentRecords || studentParentRecords.length === 0) {
      return res.status(404).json({ message: "No students found for this parent" });
    }

    // Get all student IDs
    const studentIds = studentParentRecords.map(record => record.id_student);

    // Fetch all students with these IDs
    const students = await Student.findAll({
      where: { id_student: studentIds },
      include: [
        {
          model: User,
          attributes: ["login", "email", "first_name", "last_name", "middle_name", "gender", "photo"],
        },
        {
          model: Class,
          attributes: ["class_number", "class_letter"],
        },
      ],
    });

    // Format the student data
    const studentsWithClassInfo = await Promise.all(students.map(async (student) => {
      const parentRecords = await StudentParent.findAll({
        where: { id_student: student.id_student },
        include: {
          model: Parent,
          include: {
            model: User,
            attributes: ["first_name", "last_name", "middle_name"]
          }
        }
      });

      const parents = parentRecords.map(record => ({
        idParent: record.Parent.id_parent,
        firstName: record.Parent.User.first_name,
        lastName: record.Parent.User.last_name,
        middleName: record.Parent.User.middle_name
      }));

      const photoUrl = student.User.photo ? `${req.protocol}://${req.get("host")}${student.User.photo}` : null;

      return {
        student: {
          idStudent: student.id_student,
          firstName: student.User.first_name,
          lastName: student.User.last_name,
          middleName: student.User.middle_name,
          phone: student.phone,
          birthDate: student.birth_date,
          login: student.User.login,
          email: student.User.email,
          gender: student.User.gender,
          photo: photoUrl,
          documentNumber: student.document_number,
          bloodGroup: student.blood_group,
        },
        class: {
          idClass: student.id_class,
          classNumber: student.Class ? student.Class.class_number : null,
          classLetter: student.Class ? student.Class.class_letter : null
        },
        parents: parents
      };
    }));

    res.json(studentsWithClassInfo);
  } catch (error) {
    console.error("Error fetching students by parent ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateStudent = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Добавляем логирование для отладки
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { idStudent } = req.params;
    const {
      email,
      password,
      firstName,
      lastName,
      middleName,
      gender,
      login,
      idRole,
      idClass,
      phone,
      birthDate,
      documentNumber,
      bloodGroup,
    } = req.body;

    // Преобразуем строковые значения в нужные типы
    const parsedIdRole = parseInt(idRole, 10);
    const parsedIdClass = parseInt(idClass, 10);
    const parsedBloodGroup = parseInt(bloodGroup, 10);

    // Проверка обязательных полей
    if (
      !idStudent ||
      !email ||
      !firstName ||
      !lastName ||
      !gender ||
      !login ||
      !idRole ||
      !idClass ||
      !phone ||
      !birthDate ||
      !documentNumber ||
      !bloodGroup
    ) {
      // Логируем отсутствующие поля для отладки
      const missingFields = [];
      if (!idStudent) missingFields.push('idStudent');
      if (!email) missingFields.push('email');
      if (!firstName) missingFields.push('firstName');
      if (!lastName) missingFields.push('lastName');
      if (!gender) missingFields.push('gender');
      if (!login) missingFields.push('login');
      if (!idRole) missingFields.push('idRole');
      if (!idClass) missingFields.push('idClass');
      if (!phone) missingFields.push('phone');
      if (!birthDate) missingFields.push('birthDate');
      if (!documentNumber) missingFields.push('documentNumber');
      if (!bloodGroup) missingFields.push('bloodGroup');
      
      console.log("Missing fields:", missingFields);
      
      return res.status(400).json({ 
        message: "All required fields must be filled",
        missingFields: missingFields
      });
    }

    // Проверка существования студента
    const student = await Student.findByPk(idStudent, { transaction });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Обновление пользователя
    const user = await User.findByPk(student.id_user, { transaction });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Проверка уникальности email и логина (исключая текущего пользователя)
    const existingUser = await User.findOne({
      where: {
        [Op.and]: [
          { [Op.or]: [{ email }, { login }] },
          { id_user: { [Op.ne]: user.id_user } }
        ]
      },
      transaction,
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or login already exists for another user" });
    }

    // Обновляем данные пользователя
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.first_name = firstName;
    user.last_name = lastName;
    user.middle_name = middleName || null;
    user.gender = gender;
    user.login = login;
    user.id_role = parsedIdRole;

    // Обработка загруженного файла аватара
    if (req.file) {
      // Удаляем старый аватар, если он существует
      if (user.photo) {
        try {
          const oldPhotoPath = path.join(__dirname, "..", user.photo);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        } catch (err) {
          console.error("Error deleting old avatar:", err);
          // Продолжаем выполнение, даже если не удалось удалить старый файл
        }
      }

      // Устанавливаем новый путь к фотографии
      user.photo = `/uploads/userPhotos/${req.file.filename}`;
    }

    await user.save({ transaction });

    // Обновление студента
    student.id_class = parsedIdClass;
    student.phone = phone;
    student.birth_date = birthDate;
    student.document_number = documentNumber;
    student.blood_group = parsedBloodGroup;
    await student.save({ transaction });

    // Получаем информацию о классе
    const classInfo = await Class.findByPk(student.id_class, { transaction });

    // Получаем информацию о роли
    const role = await Role.findByPk(user.id_role, { transaction });
    const roleName = role ? role.name : null;

    // Подтверждение транзакции
    await transaction.commit();

    // Формируем полный URL для фото
    const photoUrl = user.photo ? `${req.protocol}://${req.get("host")}${user.photo}` : null;

    return res.status(200).json({
      message: "Student updated successfully",
      user: {
        id: user.id_user,
        email: user.email,
        login: user.login,
        idStudent: student.id_student,
        idClass: student.id_class,
        className: classInfo ? `${classInfo.class_number}${classInfo.class_letter}` : null,
        role: {
          idRole: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        photo: photoUrl,
        phone: student.phone,
        birthDate: student.birth_date,
        documentNumber: student.document_number,
        bloodGroup: student.blood_group,
      },
    });
  } catch (error) {
    console.error("Error updating student:", error);
    
    if (!transaction.finished) {
      await transaction.rollback(); // Откат транзакции в случае ошибки
    }
    
    // Удаляем загруженный файл в случае ошибки
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }

    return res.status(500).json({ message: "Error updating student", error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { idStudent } = req.params;

    // Проверка существования студента
    const student = await Student.findByPk(idStudent, { transaction });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Удаление связей студента с родителями
    await StudentParent.destroy({ where: { id_student: student.id_student }, transaction });

    // Удаление студента
    await student.destroy({ transaction });

    // Удаление пользователя
    const user = await User.findByPk(student.id_user, { transaction });
    if (user) {
      await user.destroy({ transaction });
    }

    // Подтверждение транзакции
    await transaction.commit();

    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback(); // Откат транзакции в случае ошибки
    }

    console.error("Error deleting student:", error);

    return res.status(500).json({ message: "Error deleting student", error: error.message });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentsByClass,
  getStudentById,
  getStydentsByParentId,
  updateStudent,
  deleteStudent,
};