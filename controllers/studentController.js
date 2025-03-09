const { User, Student, Role, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

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
        last_name : lastName,
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
        id_class : idClass,
        phone,
        birth_date: birthDate,
        document_number: documentNumber,
        blood_group: bloodGroup,
      },
      { transaction }
    );

    // Фиксируем изменения в базе
    await transaction.commit();

    // Создание JWT-токенов
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

    const role = await Role.findByPk(user.id_role);
    const roleName = role ? role.name : null;

    return res.json({
      message: "Student created successfully",
      user: {
        id: user.id_user,
        email: user.email,
        idClass: student.id_class,
        role: {
          id_role: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        photo: user.photo,
      },
      accessToken,
      refreshToken,
    });
  } catch (e) {
    if (!transaction.finished) {
      await transaction.rollback(); // Откатить изменения в случае ошибки
    }
    res.status(500).json({ message: "Error creating student", error: e.message });
  }
};

module.exports = {
  createStudent,
};