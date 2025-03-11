const express = require("express");
const { getAllStudents, getStudentsByClass, getStudentById } = require("../controllers");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

// Получение всех студентов
router.get("/", authenticate, getAllStudents);

// Получение студентов по классу
// Параметр :idClass - идентификатор класса
router.get("/class/:idClass", authenticate, getStudentsByClass);

// Получение студента по идентификатору
// Параметр :idStudent - идентификатор студента
router.get("/student/:idStudent", authenticate, getStudentById);

module.exports = router;