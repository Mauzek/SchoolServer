const { User, Student, Role, Class, Parent, StudentParent, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { sendEmail } = require("../utils/email");

const createStudent = async (req, res) => {
  const transaction = await sequelize.transaction(); // Открываем транзакцию
  try {
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
      photo,
    } = req.body;

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
      return res.status(400).json({ message: "All required fields must be provided" });
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

    // Создание пользователя в транзакции
    const user = await User.create(
      {
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        gender,
        login,
        id_role: idRole,
        photo,
      },
      { transaction }
    );

    // Создание студента в транзакции
    const student = await Student.create(
      {
        id_user: user.id_user,
        id_class: idClass,
        phone,
        birth_date: birthDate,
        document_number: documentNumber,
        blood_group: bloodGroup,
      },
      { transaction }
    );

    // Отправка письма с логином и паролем
    const emailText = `Здравствуйте, ${firstName} ${lastName}!\n\nВаши данные для входа в систему:\nЛогин: ${login}\nПароль: ${password}\n\nС уважением,\nАдминистрация школы`;
    await sendEmail(email, 'Регистрация в системе', emailText);

    // Фиксируем изменения в базе
    await transaction.commit();

    const role = await Role.findByPk(user.id_role);
    const roleName = role ? role.name : null;

    const classInfo = await Class.findByPk(student.id_class);

    return res.json({
      message: "Student created successfully",
      user: {
        id: user.id_user,
        email: user.email,
        login: user.login,
        idClass: student.id_class,
        className: classInfo ? `${classInfo.class_number}${classInfo.class_letter}` : null,
        role: {
          id_role: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        photo: user.photo,
      },
    });
  } catch (e) {
    if (!transaction.finished) {
      await transaction.rollback(); // Откатить изменения в случае ошибки
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
        id_parent: record.Parent.id_parent,
        firstName: record.Parent.User.first_name,
        lastName: record.Parent.User.last_name,
        middleName: record.Parent.User.middle_name
      }));

      return {
        id_student: student.id_student,
        id_user: student.id_user,
        id_class: student.id_class,
        className: student.Class ? `${student.Class.class_number}${student.Class.class_letter}` : null,
        phone: student.phone,
        birth_date: student.birth_date,
        document_number: student.document_number,
        blood_group: student.blood_group,
        firstName: student.User.first_name,
        lastName: student.User.last_name,
        middleName: student.User.middle_name,
        login: student.User.login,
        email: student.User.email,
        gender: student.User.gender,
        photo: student.User.photo,
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
        id_parent: record.Parent.id_parent,
        firstName: record.Parent.User.first_name,
        lastName: record.Parent.User.last_name,
        middleName: record.Parent.User.middle_name
      }));

      return {
        id_student: student.id_student,
        id_user: student.id_user,
        id_class: student.id_class,
        className: student.Class ? `${student.Class.class_number}${student.Class.class_letter}` : null,
        phone: student.phone,
        birth_date: student.birth_date,
        document_number: student.document_number,
        blood_group: student.blood_group,
        firstName: student.User.first_name,
        lastName: student.User.last_name,
        middleName: student.User.middle_name,
        login: student.User.login,
        email: student.User.email,
        gender: student.User.gender,
        photo: student.User.photo,
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
          attributes: ["class_number", "class_letter"],
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
      id_parent: record.Parent.id_parent,
      firstName: record.Parent.User.first_name,
      lastName: record.Parent.User.last_name,
      middleName: record.Parent.User.middle_name
    }));

    const studentWithClassInfo = {
      id_student: student.id_student,
      id_user: student.id_user,
      id_class: student.id_class,
      className: student.Class ? `${student.Class.class_number}${student.Class.class_letter}` : null,
      phone: student.phone,
      birth_date: student.birth_date,
      document_number: student.document_number,
      blood_group: student.blood_group,
      firstName: student.User.first_name,
      lastName: student.User.last_name,
      middleName: student.User.middle_name,
      login: student.User.login,
      email: student.User.email,
      gender: student.User.gender,
      photo: student.User.photo,
      parents: parents
    };

    res.json(studentWithClassInfo);
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};



module.exports = {
  createStudent,
  getAllStudents,
  getStudentsByClass,
  getStudentById,
};