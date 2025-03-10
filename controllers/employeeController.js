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

module.exports = { createEmployee };