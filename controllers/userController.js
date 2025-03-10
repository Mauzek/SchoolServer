const { User, Parent, Student, Employee, Role } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { email, password, first_name, id_role, last_name, gender, login, ...additionalParams } = req.body;
    const { role } = req.query;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    switch (role) {
      case 'parent': // Parent
        user = await User.create({
          email,
          password: hashedPassword,
          first_name,
          last_name,
          gender,
          login,
          id_role,
        });
        await Parent.create({
          id_user: user.id_user,
          ...additionalParams,
        });
        break;

      case 'student': // Student
        user = await User.create({
          email,
          password: hashedPassword,
          first_name,
          last_name,
          gender,
          login,
          id_role,
        });
        await Student.create({
          id_user: user.id_user,
          ...additionalParams,
        });
        break;

      case 'employee': // Employee
        user = await User.create({
          email,
          password: hashedPassword,
          first_name,
          last_name,
          gender,
          login,
          id_role,
        });
        await Employee.create({
          id_user: user.id_user,
          ...additionalParams,
        });
        break;

      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    const accessToken = jwt.sign({ id: user.id_user, username: user.login, role: user.id_role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign({ id: user.id, username: user.login, role: user.id_role }, process.env.JWT_REFRESH_SECRET, 
            { expiresIn: "7d" } // Срок жизни refresh token — 7 дней
          );
          
    return res.json({
      message: "User created successfully",
      user: {
        id: user.id_user,
        email: user.email,
        id_role: Role[user.id_role],
        firstName: user.first_name,
        lastName: user.last_name,
      },
      accessToken,
      refreshToken
    });
  } catch (e) {
    res.status(500).json({ message: "Error creating user", error: e.message });
  }
};

module.exports = {
  createUser,
};