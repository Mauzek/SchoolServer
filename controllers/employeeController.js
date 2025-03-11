const { User, Employee, Role, Position, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { sendEmail } = require("../utils/email");

const createEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
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
      console.log("Missing required fields");
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Проверка уникальности email и логина
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { login }] },
      transaction,
    });
    if (existingUser) {
      console.log("Email or login already exists");
      return res.status(400).json({ message: "Email or login already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
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
      },
      { transaction }
    );

    console.log("User created:", user);

    // Создание сотрудника
    const employee = await Employee.create(
      {
        id_user: user.id_user,
        id_position: idPosition,
        marital_status: maritalStatus,
        birth_date: birthDate,
        phone,
        is_staff: isStaff,
        passport_series: passportSeries,
        passport_number: passportNumber,
        work_book_number: workBookNumber,
        registration_address: registrationAddress,
        work_experience: workExperience,
        hire_date: hireDate,
      },
      { transaction }
    );

    // Отправка письма с логином и паролем
    const emailText = `Здравствуйте, ${firstName} ${lastName}!\n\nВаши данные для входа в систему:\nЛогин: ${login}\nПароль: ${password}\n\nС уважением,\nАдминистрация школы`;
    await sendEmail(email, 'Регистрация в системе', emailText);

    // Подтверждение транзакции
    await transaction.commit();

    // Извлечение имени роли по id_role
    const role = await Role.findByPk(user.id_role);
    const roleName = role ? role.name : null;

    // Извлечение имени должности по id_position
    const positionObject = await Position.findByPk(employee.id_position);
    const positionName = positionObject ? positionObject.name : null;

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
        photo: user.photo,
      },
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback(); // Откат транзакции в случае ошибки
    }

    console.error("Error creating user:", error);

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
      passportSeries,
      passportNumber,
      workBookNumber,
      registrationAddress,
      workExperience,
      hireDate,
    } = req.body;

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
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Проверка существования сотрудника
    const employee = await Employee.findByPk(idEmployee, { transaction });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Обновление пользователя
    const user = await User.findByPk(employee.id_user, { transaction });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.first_name = firstName;
    user.last_name = lastName;
    user.middle_name = middleName;
    user.gender = gender;
    user.login = login;
    user.id_role = idRole;
    await user.save({ transaction });

    // Обновление сотрудника
    employee.id_position = idPosition;
    employee.marital_status = maritalStatus;
    employee.birth_date = birthDate;
    employee.phone = phone;
    employee.passport_series = passportSeries;
    employee.passport_number = passportNumber;
    employee.work_book_number = workBookNumber;
    employee.registration_address = registrationAddress;
    employee.work_experience = workExperience;
    employee.hire_date = hireDate;
    await employee.save({ transaction });

    // Подтверждение транзакции
    await transaction.commit();

    return res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback(); // Откат транзакции в случае ошибки
    }

    console.error("Error updating employee:", error);

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
            attributes: ["name"],
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
      photo: employee.User.photo,
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

    const formattedEmployee = {
      idEmployee: employee.id_employee,
      idUser: employee.User.id_user,
      login: employee.User.login,
      email: employee.User.email,
      firstName: employee.User.first_name,
      lastName: employee.User.last_name,
      middleName: employee.User.middle_name,
      gender: employee.User.gender,
      photo: employee.User.photo,
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