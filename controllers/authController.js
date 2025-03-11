const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createEmployee } = require("./employeeController");
const { createParent } = require("./parentController");
const { createStudent } = require("./studentController");
const { Role, Student, Employee, Parent, StudentParent, Class } = require("../models");

// Логин пользователя
const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Поиск пользователя по логину
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Сравнение пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    // Извлечение имени роли по id_role
    const role = await Role.findByPk(user.id_role);
    const roleName = role ? role.name : null;

    // Извлечение дополнительной информации в зависимости от роли
    let additionalInfo = {};
    switch (user.id_role) {
      case 4: // Parent
        const parent = await Parent.findOne({ where: { id_user: user.id_user } });
        if (parent) {
          const studentParentRecords = await StudentParent.findAll({
            where: { id_parent: parent.id_parent },
            attributes: ['id_student']
          });
          const childrenIds = studentParentRecords.map(record => record.id_student);
          additionalInfo = {
            parentId: parent.id_parent,
            childrenIds: childrenIds
          };
        }
        break;
      case 3: // Student
        const student = await Student.findOne({ where: { id_user: user.id_user } });
        const studClass = await Class.findOne({ where: { id_class: student.id_class } });
        if (student) {
          additionalInfo = {
            idClass: student.id_class,
            name: studClass.class_number + studClass.class_letter,
          };
        }
        break;
      case 2: // Employee
        const employee = await Employee.findOne({ where: { id_user: user.id_user } });
        if (employee && !employee.is_staff) {
          return res.status(403).json({ message: "Сотрудник уволен" });
        }
        if (employee) {
          additionalInfo = {
            position: employee.id_position
          };
        }
        break;
      default:
        break;
    }

    // Генерация токена JWT
    const accessToken = jwt.sign(
      { id: user.id_user, username: user.login, role: user.id_role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Генерация refresh токена
    const refreshToken = jwt.sign(
      { id: user.id_user, username: user.login, role: user.id_role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Успешный вход",
      user: {
        id: user.id_user,
        email: user.email,
        role: {
          idRole: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        photo: user.photo,
        ...additionalInfo
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token отсутствует." });
  }

  // Проверяем рефреш-токен
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Refresh token недействителен." });
      }

      // Если refresh токен валиден, создаем новый access token
      const newAccessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Отправляем новый access token клиенту
      res.json({ message: "Токен обновлён", accessToken: newAccessToken });
    }
  );
};

const register = async (req, res) => {
  const { role } = req.query;

  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  switch (role) {
    case "parent":
      return createParent(req, res);
    case "student":
      return createStudent(req, res);
    case "employee":
      return createEmployee(req, res);
    default:
      return res.status(400).json({ message: "Invalid role" });
  }
};

module.exports = { login, refreshAccessToken, register };