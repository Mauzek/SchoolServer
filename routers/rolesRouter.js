const express = require("express");
const {
  getAllRoles,
  getRoleById,
  deleteRole,
  updateRole,
  createRole,
} = require("../controllers");
const { authenticate } = require("../middlewares");
const router = express.Router();

// Создание роли
router.get("/all", authenticate, getAllRoles);

// Получение роли по идентификатору
router.get("/:idRole", authenticate, getRoleById);

// Создание роли
router.post("/", authenticate, createRole);

// Обновление роли
router.put("/:idRole", authenticate, updateRole);

// Удаление роли
router.delete("/:idRole", authenticate, deleteRole);

module.exports = router;