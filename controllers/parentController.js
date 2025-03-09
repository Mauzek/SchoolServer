const { User, Parent, StudentParent, Role, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const createParent = async (req, res) => {
  const transaction = await sequelize.transaction(); // Открываем транзакцию
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
      parent_type,
      phone,
      work_phone,
      workplace,
      position,
      children_count,
      passport_series,
      passport_number,
      registration_address,
      children_ids,
    } = req.body;

    // Проверка обязательных полей
    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !gender ||
      !login ||
      !id_role ||
      !parent_type ||
      !phone ||
      !children_count ||
      !passport_series ||
      !passport_number ||
      !registration_address
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Проверка уникальности email и логина
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { login }] },
      transaction,
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
        first_name,
        last_name,
        middle_name,
        gender,
        login,
        id_role,
      },
      { transaction }
    );

    // Создание родителя в транзакции
    const parent = await Parent.create(
      {
        id_user: user.id_user,
        parent_type,
        phone,
        work_phone,
        workplace,
        position,
        children_count,
        passport_series,
        passport_number,
        registration_address,
      },
      { transaction }
    );

    // Добавление связей родителя с детьми, если они указаны
    if (Array.isArray(children_ids) && children_ids.length > 0) {
      const studentParentRecords = children_ids.map((id_student) => ({
        id_parent: parent.id_parent,
        id_student,
      }));

      await StudentParent.bulkCreate(studentParentRecords, { transaction });
    }

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
      message: "Parent created successfully",
      user: {
        id: user.id_user,
        email: user.email,
        role: {
          id_role: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        id_parent: parent.id_parent,
        children_ids: children_ids,
        photo: user.photo,
      },
      accessToken,
      refreshToken,
    });
  } catch (e) {
    if (!transaction.finished) {
      await transaction.rollback(); // Откатить изменения в случае ошибки
    }
    res.status(500).json({ message: "Error creating parent", error: e.message });
  }
};

module.exports = {
  createParent,
};