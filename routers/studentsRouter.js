const express = require("express");
const { getStudents, getStudentsByClass, getStudentById } = require("../controllers/studentController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

// Получение всех студентов
router.get("/students", authenticate, getStudents);

// Получение студентов по классу
// Параметр :idClass - идентификатор класса
router.get("/students/class/:idClass", authenticate, getStudentsByClass);

router.get("/student/:idStudent", authenticate, getStudentById);

module.exports = router;