const express = require("express");
const {
  getAllStudents,
  getStudentsByClass,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers");
const { authenticate } = require("../middlewares");
const router = express.Router();

// Получение всех студентов
router.get("/all", authenticate, getAllStudents);

// Получение студентов по классу
// Параметр :idClass - идентификатор класса
router.get("/class/:idClass", authenticate, getStudentsByClass);

// Получение студента по идентификатору
// Параметр :idStudent - идентификатор студента
router.get("/:idStudent", authenticate, getStudentById);

// Обновление студента
// Параметр :idStudent - идентификатор студента
router.put("/:idStudent", authenticate, updateStudent);

// Удаление студента
// Параметр :idStudent - идентификатор студента
router.delete("/:idStudent", authenticate, deleteStudent);

module.exports = router;
