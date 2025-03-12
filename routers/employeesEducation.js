const express = require("express");
const { authenticate } = require("../middlewares");
const {
    createEmployeeEducation,
    updateEmployeeEducationById,
    deleteEmployeeEducationById,
    getEmployeeEducationsByEmployeeId,
    getAllEducationSettings
} = require("../controllers");
const router = express.Router();

// Получение всех образований сотрудника
router.get("/:idEmployee", authenticate, getEmployeeEducationsByEmployeeId);
// Получение всех настроек образования
router.get("/settings/all", authenticate, getAllEducationSettings);
// Создание нового образования сотрудника
router.post("/", authenticate, createEmployeeEducation);
// Обновление образования сотрудника по идентификатору
router.put("/:idEmployeeEducation", authenticate, updateEmployeeEducationById);
// Удаление образования сотрудника по идентификатору
router.delete("/:idEmployeeEducation", authenticate, deleteEmployeeEducationById);

module.exports = router;