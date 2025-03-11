const express = require("express");
const { getEmployeeById, getAllEmployees, updateEmployee, deleteEmployee } = require("../controllers");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

// Получение всех сотрудников
router.get("/all", authenticate, getAllEmployees);

// Получение сотрудника по идентификатору
router.get("/:idEmployee", authenticate, getEmployeeById);

// Обновление сотрудника
router.put("/:idEmployee", authenticate, updateEmployee);

// Обновление статуса сотрудника (увольнение)
router.put("/:idEmployee/status", authenticate, deleteEmployee);

module.exports = router;