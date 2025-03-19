const { User, Employee, Role, Position, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { sendEmail } = require("../utils/email");

const createEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
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
      idPosition,
      maritalStatus,
      birthDate,
      phone,
      isStaff,
      passportSeries,
      passportNumber,
      workBookNumber,
      registrationAddress,
      workExperience,
      hireDate,
    } = req.body;

    // Преобразуем строковые значения в нужные типы
    const parsedIdRole = parseInt(idRole, 10);
    const parsedIdPosition = parseInt(idPosition, 10);
    const parsedIsStaff = isStaff === 'true' || isStaff === '1' || isStaff === true;
    const parsedWorkExperience = parseFloat(workExperience);

    // Проверка наличия обязательных полей
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !gender ||
      !login ||
      !idRole ||
      !phone ||
      !passportSeries ||
      !passportNumber ||
      !registrationAddress ||
      !workExperience ||
      !hireDate ||
      !idPosition
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
      if (!phone) missingFields.push('phone');
      if (!passportSeries) missingFields.push('passportSeries');
      if (!passportNumber) missingFields.push('passportNumber');
      if (!registrationAddress) missingFields.push('registrationAddress');
      if (!workExperience) missingFields.push('workExperience');
      if (!hireDate) missingFields.push('hireDate');
      if (!idPosition) missingFields.push('idPosition');
      
      console.log("Missing required fields:", missingFields);
      
      // Удаляем загруженный файл в случае ошибки
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      }
      
      return res.status(400).json({ 
        message: "All required fields must be filled",
        missingFields: missingFields
      });
    }

    // Проверка уникальности email и логина
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { login }] },
      transaction,
    });
    
    if (existingUser) {
      console.log("Email or login already exists");
      
      // Удаляем загруженный файл в случае ошибки
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      }
      
      return res.status(400).json({ message: "Email or login already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Получаем путь к загруженной фотографии, если она есть
    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/userPhotos/${req.file.filename}`;
    }

    // Создание пользователя
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

    console.log("User created:", user);

    // Создание сотрудника
    const employee = await Employee.create(
      {
        id_user: user.id_user,
        id_position: parsedIdPosition,
        marital_status: maritalStatus || null,
        birth_date: birthDate || null,
        phone,
        is_staff: parsedIsStaff,
        passport_series: passportSeries,
        passport_number: passportNumber,
        work_book_number: workBookNumber || null,
        registration_address: registrationAddress,
        work_experience: parsedWorkExperience,
        hire_date: hireDate,
      },
      { transaction }
    );

    // Отправка письма с логином и паролем
    const emailText = `Здравствуйте, ${firstName} ${lastName}!\n\nВаши данные для входа в систему:\nЛогин: ${login}\nПароль: ${password}\n\nС уважением,\nАдминистрация школы`;
    sendEmail(email, 'Регистрация в системе', emailText);

    // Подтверждение транзакции
    await transaction.commit();

    // Извлечение имени роли по id_role
    const role = await Role.findByPk(user.id_role);
    const roleName = role ? role.name : null;

    // Извлечение имени должности по id_position
    const positionObject = await Position.findByPk(employee.id_position);
    const positionName = positionObject ? positionObject.name : null;

    // Формируем полный URL для фото
    const photoUrl = photoPath ? `${req.protocol}://${req.get("host")}${photoPath}` : null;

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id_user,
        email: user.email,
        login: user.login,
        position: {
          idPosition: employee.id_position,
          name: positionName,
        },
        role: {
          idRole: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        photo: photoUrl,
        idEmployee: employee.id_employee,
        maritalStatus: employee.marital_status,
        birthDate: employee.birth_date,
        phone: employee.phone,
        isStaff: employee.is_staff,
        passportSeries: employee.passport_series,
        passportNumber: employee.passport_number,
        workBookNumber: employee.work_book_number,
        registrationAddress: employee.registration_address,
        workExperience: employee.work_experience,
        hireDate: employee.hire_date,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    
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

    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Добавляем логирование для отладки
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { idEmployee } = req.params;
    const {
      email,
      password,
      firstName,
      lastName,
      middleName,
      gender,
      login,
      idRole,
      idPosition,
      maritalStatus,
      birthDate,
      phone,
      isStaff,
      passportSeries,
      passportNumber,
      workBookNumber,
      registrationAddress,
      workExperience,
      hireDate,
    } = req.body;

    // Преобразуем строковые значения в нужные типы
    const parsedIdRole = parseInt(idRole, 10);
    const parsedIdPosition = parseInt(idPosition, 10);
    const parsedIsStaff = isStaff === 'true' || isStaff === '1' || isStaff === true;
    const parsedWorkExperience = parseFloat(workExperience);

    // Проверка наличия обязательных полей
    if (
      !idEmployee ||
      !email ||
      !firstName ||
      !lastName ||
      !gender ||
      !login ||
      !idRole ||
      !phone ||
      !passportSeries ||
      !passportNumber ||
      !registrationAddress ||
      !workExperience ||
      !hireDate ||
      !idPosition
    ) {
      // Логируем отсутствующие поля для отладки
      const missingFields = [];
      if (!idEmployee) missingFields.push('idEmployee');
      if (!email) missingFields.push('email');
      if (!firstName) missingFields.push('firstName');
      if (!lastName) missingFields.push('lastName');
      if (!gender) missingFields.push('gender');
      if (!login) missingFields.push('login');
      if (!idRole) missingFields.push('idRole');
      if (!phone) missingFields.push('phone');
      if (!passportSeries) missingFields.push('passportSeries');
      if (!passportNumber) missingFields.push('passportNumber');
      if (!registrationAddress) missingFields.push('registrationAddress');
      if (!workExperience) missingFields.push('workExperience');
      if (!hireDate) missingFields.push('hireDate');
      if (!idPosition) missingFields.push('idPosition');
      
      console.log("Missing required fields:", missingFields);
      
      // Удаляем загруженный файл в случае ошибки
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      }
      
      return res.status(400).json({ 
        message: "All required fields must be filled",
        missingFields: missingFields
      });
    }

    // Проверка существования сотрудника
    const employee = await Employee.findByPk(idEmployee, { transaction });
    if (!employee) {
      // Удаляем загруженный файл в случае ошибки
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      }
      
      return res.status(404).json({ message: "Employee not found" });
    }

    // Обновление пользователя
    const user = await User.findByPk(employee.id_user, { transaction });
    if (!user) {
      // Удаляем загруженный файл в случае ошибки
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      }
      
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
      // Удаляем загруженный файл в случае ошибки
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      }
      
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

    // Обновление сотрудника
    employee.id_position = parsedIdPosition;
    employee.marital_status = maritalStatus || null;
    employee.birth_date = birthDate || null;
    employee.phone = phone;
    employee.is_staff = parsedIsStaff;
    employee.passport_series = passportSeries;
    employee.passport_number = passportNumber;
    employee.work_book_number = workBookNumber || null;
    employee.registration_address = registrationAddress;
    employee.work_experience = parsedWorkExperience;
    employee.hire_date = hireDate;
    await employee.save({ transaction });
    // Получаем информацию о роли
    const role = await Role.findByPk(user.id_role, { transaction });
    const roleName = role ? role.name : null;

    // Получаем информацию о должности
    const positionObject = await Position.findByPk(employee.id_position, { transaction });
    const positionName = positionObject ? positionObject.name : null;

    // Подтверждение транзакции
    await transaction.commit();

    // Формируем полный URL для фото
    const photoUrl = user.photo ? `${req.protocol}://${req.get("host")}${user.photo}` : null;

    return res.status(200).json({
      message: "Employee updated successfully",
      user: {
        id: user.id_user,
        email: user.email,
        login: user.login,
        position: {
          idPosition: employee.id_position,
          name: positionName,
        },
        role: {
          idRole: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        photo: photoUrl,
        idEmployee: employee.id_employee,
        maritalStatus: employee.marital_status,
        birthDate: employee.birth_date,
        phone: employee.phone,
        isStaff: employee.is_staff,
        passportSeries: employee.passport_series,
        passportNumber: employee.passport_number,
        workBookNumber: employee.work_book_number,
        registrationAddress: employee.registration_address,
        workExperience: employee.work_experience,
        hireDate: employee.hire_date,
      }
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    
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

    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({ message: "Error updating employee", error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { idEmployee } = req.params;

    // Проверка существования сотрудника
    const employee = await Employee.findByPk(idEmployee, { transaction });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Обновление поля isStaff
    employee.is_staff = false;
    await employee.save({ transaction });

    // Подтверждение транзакции
    await transaction.commit();

    return res.status(200).json({ message: "Employee marked as inactive successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback(); // Откат транзакции в случае ошибки
    }

    console.error("Error deleting employee:", error);

    return res.status(500).json({ message: "Error deleting employee", error: error.message });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        {
          model: User,
          attributes: ["login", "email", "first_name", "last_name", "middle_name", "gender", "photo"],
          include: [{
            model: Role,
            attributes: ["id_role","name"],
          },],
        },
        {
          model: Position,
          attributes: ["name"],
        },

      ],
    });
    
    const formattedEmployees = employees.map(employee => ({
      idEmployee: employee.id_employee,
      idUser: employee.User.id_user,
      login: employee.User.login,
      email: employee.User.email,
      firstName: employee.User.first_name,
      lastName: employee.User.last_name,
      middleName: employee.User.middle_name,
      gender: employee.User.gender,
      photo: employee.User.photo ? `${req.protocol}://${req.get("host")}${employee.User.photo}` : null,
      position: {
        idPosition: employee.id_position,
        name: employee.Position.name,
      },
      role: {
        id: employee.User.Role.id_role,
        name: employee.User.Role.name,
      },
      maritalStatus: employee.marital_status,
      birthDate: employee.birth_date,
      phone: employee.phone,
      isStaff: employee.is_staff,
      passportSeries: employee.passport_series,
      passportNumber: employee.passport_number,
      workBookNumber: employee.work_book_number,
      registrationAddress: employee.registration_address,
      workExperience: employee.work_experience,
      hireDate: employee.hire_date,
    }));

    res.json(formattedEmployees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  const { idEmployee } = req.params;

  try {
    const employee = await Employee.findOne({
      where: { id_employee: idEmployee },
      include: [
        {
          model: User,
          attributes: ["id_user", "login", "email", "first_name", "last_name", "middle_name", "gender", "photo"],
          include: [
            {
              model: Role,
              attributes: ["name"],
            },
          ],
        },
        {
          model: Position,
          attributes: ["id_position", "name"],
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const photoUrl = employee.User.photo ? `${req.protocol}://${req.get("host")}${employee.User.photo}` : null;

    const formattedEmployee = {
      idEmployee: employee.id_employee,
      idUser: employee.User.id_user,
      login: employee.User.login,
      email: employee.User.email,
      firstName: employee.User.first_name,
      lastName: employee.User.last_name,
      middleName: employee.User.middle_name,
      gender: employee.User.gender,
      photo: photoUrl,
      position: {
        idPosition: employee.id_position,
        name: employee.Position.name,
      },
      role: {
        idRole: employee.User.id_role,
        name: employee.User.Role.name,
      },
      maritalStatus: employee.marital_status,
      birthDate: employee.birth_date,
      phone: employee.phone,
      isStaff: employee.is_staff,
      passportSeries: employee.passport_series,
      passportNumber: employee.passport_number,
      workBookNumber: employee.work_book_number,
      registrationAddress: employee.registration_address,
      workExperience: employee.work_experience,
      hireDate: employee.hire_date,
    };

    res.json(formattedEmployee);
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
};