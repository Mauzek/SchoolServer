const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createEmployee } = require("./employeeController");
const { createParent } = require("./parentController");
const { createStudent } = require("./studentController");
const {
  Role,
  Student,
  Employee,
  Position,
  Parent,
  StudentParent,
  Class,
} = require("../models");

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
        const parent = await Parent.findOne({
          where: { id_user: user.id_user },
        });
        if (parent) {
          const studentParentRecords = await StudentParent.findAll({
            where: { id_parent: parent.id_parent },
            attributes: ["id_student"],
          });
          const childrenIds = studentParentRecords.map(
            (record) => record.id_student
          );
          additionalInfo = {
            idParent: parent.id_parent,
            childrenIds: childrenIds,
          };
        }
        break;
      case 3: // Student
        const student = await Student.findOne({
          where: { id_user: user.id_user },
        });
        const studClass = await Class.findOne({
          where: { id_class: student.id_class },
        });
        if (student) {
          additionalInfo = {
            idStudent: student.id_student,
            idClass: student.id_class,
            classNumber: studClass.class_number,
            classLetter: studClass.class_letter,
          };
        }
        break;
      case 1:
      case 2: // Employee
        const employee = await Employee.findOne({
          where: { id_user: user.id_user },
          include: { model: Position, attributes: ["name"] },
        });
        if (employee && !employee.is_staff) {
          return res.status(403).json({ message: "Сотрудник уволен" });
        }
        if (employee) {
          additionalInfo = {
            idEmployee: employee.id_employee,
            position: {
              id: employee.id_position,
              name: employee.Position.name,
            },
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
        login: user.login,
        role: {
          idRole: user.id_role,
          name: roleName,
        },
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        photo: user.photo,
        additionalInfo: additionalInfo,
      },
      accessToken,
      refreshToken,
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

const loginWithJWT = async (req, res) => {
  const { accessToken, refreshToken } = req.body;

  if (!accessToken || !refreshToken) {
    return res
      .status(400)
      .json({ message: "Access and refresh tokens are required" });
  }

  try {
    // Try to verify the access token
    let decodedAccessToken;
    let newAccessToken = null;

    try {
      decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (error) {
      // If access token is invalid or expired, try to use refresh token
      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );

        // Generate new access token
        newAccessToken = jwt.sign(
          {
            id: decodedRefreshToken.id,
            username: decodedRefreshToken.username,
            role: decodedRefreshToken.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        decodedAccessToken = jwt.decode(newAccessToken);
      } catch (refreshError) {
        return res
          .status(401)
          .json({ message: "Invalid refresh token. Please login again." });
      }
    }

    // Verify refresh token
    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );
    } catch (error) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Check if tokens belong to the same user
    if (decodedAccessToken.id !== decodedRefreshToken.id) {
      return res.status(401).json({ message: "Token mismatch" });
    }

    // Find user
    const user = await User.findOne({
      where: { id_user: decodedAccessToken.id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get role name
    const role = await Role.findByPk(user.id_role);
    const roleName = role ? role.name : null;

    // Get additional info based on role
    let additionalInfo = {};
    switch (user.id_role) {
      case 4: // Parent
        const parent = await Parent.findOne({
          where: { id_user: user.id_user },
        });
        if (parent) {
          const studentParentRecords = await StudentParent.findAll({
            where: { id_parent: parent.id_parent },
            attributes: ["id_student"],
          });
          const childrenIds = studentParentRecords.map(
            (record) => record.id_student
          );
          additionalInfo = {
            idParent: parent.id_parent,
            childrenIds: childrenIds,
          };
        }
        break;
      case 3: // Student
        const student = await Student.findOne({
          where: { id_user: user.id_user },
        });
        const studClass = await Class.findOne({
          where: { id_class: student.id_class },
        });
        if (student) {
          additionalInfo = {
            idStudent: student.id_student,
            idClass: student.id_class,
            classNumber: studClass.class_number,
            classLetter: studClass.class_letter,
          };
        }
        break;
      case 1:
      case 2: // Employee
        const employee = await Employee.findOne({
          where: { id_user: user.id_user },
          include: { model: Position, attributes: ["name"] },
        });
        if (employee && !employee.is_staff) {
          return res.status(403).json({ message: "Сотрудник уволен" });
        }
        if (employee) {
          additionalInfo = {
            idEmployee: employee.id_employee,
            position: {
              id: employee.id_position,
              name: employee.Position.name,
            },
          };
        }
        break;
      default:
        break;
    }

    // If we generated a new access token, use it, otherwise use the original
    const responseAccessToken = newAccessToken || accessToken;

    res.json({
      message: "Успешная авторизация по токену",
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
        photo: user.photo,
        additionalInfo: additionalInfo,
      },
      accessToken: responseAccessToken,
      refreshToken,
      tokenRefreshed: newAccessToken !== null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

module.exports = { login, refreshAccessToken, register, loginWithJWT };
