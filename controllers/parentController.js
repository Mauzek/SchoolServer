const { User, Parent, StudentParent, Student, Role, sequelize, Class } = require("../models");
const bcrypt = require("bcryptjs");
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
    sendEmail(email, 'Регистрация в системе', emailText);

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

const updateParent = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { idParent } = req.params;
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

    // Проверка наличия обязательных полей
    if (
      !idParent ||
      !email ||
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
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Проверка существования родителя
    const parent = await Parent.findByPk(idParent, { transaction });
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    // Обновление пользователя
    const user = await User.findByPk(parent.id_user, { transaction });
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

    // Обновление родителя
    parent.parent_type = parentType;
    parent.phone = phone;
    parent.work_phone = workPhone;
    parent.workplace = workplace;
    parent.position = position;
    parent.children_count = childrenCount;
    parent.passport_series = passportSeries;
    parent.passport_number = passportNumber;
    parent.registration_address = registrationAddress;
    await parent.save({ transaction });

    // Обновление связей родителя с детьми, если они указаны
    if (Array.isArray(childrenIds) && childrenIds.length > 0) {
      await StudentParent.destroy({ where: { id_parent: parent.id_parent }, transaction });
      const studentParentRecords = childrenIds.map((idStudent) => ({
        id_parent: parent.id_parent,
        id_student: idStudent,
      }));
      await StudentParent.bulkCreate(studentParentRecords, { transaction });
    }

    // Подтверждение транзакции
    await transaction.commit();

    return res.status(200).json({ message: "Parent updated successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback(); // Откат транзакции в случае ошибки
    }

    console.error("Error updating parent:", error);

    return res.status(500).json({ message: "Error updating parent", error: error.message });
  }
};

const deleteParent = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { idParent } = req.params;

    // Проверка существования родителя
    const parent = await Parent.findByPk(idParent, { transaction });
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    // Удаление связей родителя с детьми
    await StudentParent.destroy({ where: { id_parent: parent.id_parent }, transaction });

    // Удаление родителя
    await parent.destroy({ transaction });

    // Удаление пользователя
    const user = await User.findByPk(parent.id_user, { transaction });
    if (user) {
      await user.destroy({ transaction });
    }

    // Подтверждение транзакции
    await transaction.commit();

    return res.status(200).json({ message: "Parent deleted successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback(); // Откат транзакции в случае ошибки
    }

    console.error("Error deleting parent:", error);

    return res.status(500).json({ message: "Error deleting parent", error: error.message });
  }
};

const getAllParents = async (req, res) => {
  try {
    const parents = await Parent.findAll({
      include: [
        {
          model: User,
          attributes: ["login", "email", "first_name", "last_name", "middle_name", "gender", "photo"],
          include: [
            {
              model: Role,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    const formattedParents = parents.map(parent => ({
      idParent: parent.id_parent,
      idUser: parent.User.id_user,
      login: parent.User.login,
      email: parent.User.email,
      firstName: parent.User.first_name,
      lastName: parent.User.last_name,
      middleName: parent.User.middle_name,
      gender: parent.User.gender,
      photo: parent.User.photo,
      role: {
        idRole: parent.User.id_role,
        name: parent.User.Role.name,
      },
      parentType: parent.parent_type,
      phone: parent.phone,
      workPhone: parent.work_phone,
      workplace: parent.workplace,
      position: parent.position,
      childrenCount: parent.children_count,
      passportSeries: parent.passport_series,
      passportNumber: parent.passport_number,
      registrationAddress: parent.registration_address,
    }));

    res.json(formattedParents);
  } catch (error) {
    console.error("Error fetching parents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getParentById = async (req, res) => {
  const { idParent } = req.params;

  try {
    const parent = await Parent.findOne({
      where: { id_parent: idParent },
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
          model: StudentParent,
          attributes: ["id_student"],
          include: [
            {
              model: Student,
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
            },
          ],
        },
      ],
    });

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const children = parent.StudentParents.map(sp => ({
      idStudent: sp.Student.id_student,
      firstName: sp.Student.User.first_name,
      lastName: sp.Student.User.last_name,
      middleName: sp.Student.User.middle_name,
      idClass: sp.Student.Class ? sp.Student.Class.id_class : null,
      className: sp.Student.Class ? `${sp.Student.Class.class_number}${sp.Student.Class.class_letter}` : null,
      photo: sp.Student.User.photo,
      role: { idRole: sp.Student.User.id_role, name: sp.Student.User.Role.name },
    }));

    const formattedParent = {
      idParent: parent.id_parent,
      idUser: parent.User.id_user,
      login: parent.User.login,
      email: parent.User.email,
      firstName: parent.User.first_name,
      lastName: parent.User.last_name,
      middleName: parent.User.middle_name,
      gender: parent.User.gender,
      photo: parent.User.photo,
      role: {
        idRole: parent.User.id_role,
        name: parent.User.Role.name,
      },
      parentType: parent.parent_type,
      phone: parent.phone,
      workPhone: parent.work_phone,
      workplace: parent.workplace,
      position: parent.position,
      childrenCount: parent.children_count,
      passportSeries: parent.passport_series,
      passportNumber: parent.passport_number,
      registrationAddress: parent.registration_address,
      children: children,
    };

    res.json(formattedParent);
  } catch (error) {
    console.error("Error fetching parent by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createParent,
  updateParent,
  deleteParent,
  getAllParents,
  getParentById,
};