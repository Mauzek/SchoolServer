const { User, Parent, StudentParent, Student, Role, sequelize, Class } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { sendEmail } = require("../utils/email");

const createParent = async (req, res) => {
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
      parentType,
      phone,
      workPhone,
      workplace,
      position,
      childrenCount,
      passportSeries,
      passportNumber,
      registrationAddress,
      childrenIds,
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
      !parentType ||
      !phone ||
      !childrenCount ||
      !passportSeries ||
      !passportNumber ||
      !registrationAddress
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
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        gender,
        login,
        id_role: idRole,
      },
      { transaction }
    );

    // Создание родителя в транзакции
    const parent = await Parent.create(
      {
        id_user: user.id_user,
        parent_type: parentType,
        phone,
        work_phone: workPhone,
        workplace,
        position,
        children_count: childrenCount,
        passport_series: passportSeries,
        passport_number: passportNumber,
        registration_address: registrationAddress,
      },
      { transaction }
    );

    // Добавление связей родителя с детьми, если они указаны
    let children = [];
    if (Array.isArray(childrenIds) && childrenIds.length > 0) {
      const studentParentRecords = childrenIds.map((idStudent) => ({
        id_parent: parent.id_parent,
        id_student: idStudent,
      }));

      await StudentParent.bulkCreate(studentParentRecords, { transaction });

      // Получение информации о студентах
      children = await Student.findAll({
        where: { id_student: childrenIds },
        include: [
          {
            model: User,
            attributes: ["first_name", "last_name", "middle_name", "photo", "id_role"],
            include: { model: Role, attributes: ["name"] },
          },
          {
            model: Class,
            attributes: ["class_number", "class_letter", "id_class"],
          },
        ],
        transaction,
      });
    }

    // Отправка письма с логином и паролем
    const emailText = `Здравствуйте, ${firstName} ${lastName}!\n\nВаши данные для входа в систему:\nЛогин: ${login}\nПароль: ${password}\n\nС уважением,\nАдминистрация школы`;
    await sendEmail(email, 'Регистрация в системе', emailText);

    // Фиксируем изменения в базе
    await transaction.commit();

    const role = await Role.findByPk(user.id_role);
    const roleName = role ? role.name : null;

    return res.json({
      message: "Parent created successfully",
      user: {
        id: user.id_user,
        email: user.email,
        login: user.login,
        role: {
          idRole: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        idParent: parent.id_parent,
        children: children.map(child => ({
          idStudent: child.id_student,
          firstName: child.User.first_name,
          lastName: child.User.last_name,
          middleName: child.User.middle_name,
          idClass: child.Class ? child.Class.id_class : null,
          className: child.Class ? `${child.Class.class_number}${child.Class.class_letter}` : null,
          photo: child.User.photo,
          role: { idRole: child.User.id_role, name: child.User.Role.name },
        })),
        photo: user.photo,
      },
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