const express = require("express");
const { authenticate } = require("../middlewares");
const {
    createClass,
    updateClassById,
    deleteClassById,
    getClassById,
    getClassByNumberAndLetter,
    getClassesByEmployeeId,
    getAllClasses,
} = require("../controllers");
const router = express.Router();

// Получение всех классов
router.get("/all", authenticate, getAllClasses);
// Получение класса по идентификатору
router.get("/:idClass", authenticate, getClassById);
// Получение класса по номеру и букве (не работает)
router.get("/numberAndLetter/:classNumberAndLetter", authenticate, getClassByNumberAndLetter);
// Получение классов по идентификатору сотрудника
router.get("/employee/:idEmployee", authenticate, getClassesByEmployeeId);
// Создание нового класса
router.post("/", authenticate, createClass);
// Обновление класса по идентификатору
router.put("/:idClass", authenticate, updateClassById);
// Удаление класса по идентификатору
router.delete("/:idClass", authenticate, deleteClassById);

module.exports = router;