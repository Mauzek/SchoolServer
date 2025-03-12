const { Role, User } = require("../models");

// Создание роли
const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    // Проверка наличия обязательных полей
    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    // Проверка уникальности имени роли
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ message: "Role name already exists" });
    }

    // Создание роли
    const role = await Role.create({ name });

    return res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Обновление роли
const updateRole = async (req, res) => {
  try {
    const { idRole } = req.params;
    const { name } = req.body;

    // Проверка наличия обязательных полей
    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    // Проверка существования роли
    const role = await Role.findByPk(idRole);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Обновление роли
    role.name = name;
    await role.save();

    return res.status(200).json({ message: "Role updated successfully", role });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Получение всех ролей
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    return res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Получение роли по идентификатору
const getRoleById = async (req, res) => {
  try {
    const { idRole } = req.params;

    const role = await Role.findByPk(idRole);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.error("Error fetching role by ID:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Удаление роли
const deleteRole = async (req, res) => {
  try {
    const { idRole } = req.params;

    // Проверка существования роли
    const role = await Role.findByPk(idRole);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Проверка наличия пользователей с этой ролью
    const usersWithRole = await User.findOne({ where: { id_role: idRole } });
    if (usersWithRole) {
      return res.status(400).json({ message: "Cannot delete role because it is assigned to one or more users" });
    }

    // Удаление роли
    await role.destroy();

    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createRole,
  updateRole,
  getAllRoles,
  getRoleById,
  deleteRole,
};