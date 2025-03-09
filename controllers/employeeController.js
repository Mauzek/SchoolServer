const { User, Employee, Role, Position, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");

const createEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      middle_name,
      gender,
      login,
      id_role,
      id_position,
      marital_status,
      birth_date,
      phone,
      is_staff,
      passport_series,
      passport_number,
      work_book_number,
      registration_address,
      work_experience,
      hire_date,
    } = req.body;

    // Проверка наличия обязательных полей
    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !gender ||
      !login ||
      !id_role ||
      !phone ||
      !passport_series ||
      !passport_number ||
      !registration_address ||
      !work_experience ||
      !hire_date ||
      !id_position
    ) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Проверка уникальности email и логина
    const existingUser = await User.findOne({
      where: { [Sequelize.Op.or]: [{ email }, { login }] },
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
        first_name,
        last_name,
        middle_name,
        gender,
        login,
        id_role,
      },
      { transaction }
    );

    console.log("User created:", user);

    // Создание сотрудника
    const employee = await Employee.create(
      {
        id_user: user.id_user,
        id_position,
        marital_status,
        birth_date,
        phone,
        is_staff,
        passport_series,
        passport_number,
        work_book_number,
        registration_address,
        work_experience,
        hire_date,
      },
      { transaction }
    );

    console.log("Employee created:", employee);

    // Подтверждение транзакции
    await transaction.commit();

    // Генерация токенов
    const accessToken = jwt.sign(
      { id: user.id_user, username: user.login, role: user.id_role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { id: user.id_user, username: user.login, role: user.id_role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

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
          id_position: employee.id_position,
          name: positionName,
        },
        role: {
          id_role: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        photo: user.photo,
      },
      accessToken,
      refreshToken,
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

    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

module.exports = { createEmployee };