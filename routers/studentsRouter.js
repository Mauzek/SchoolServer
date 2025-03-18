const express = require("express");
const {
  getAllStudents,
  getStudentsByClass,
  getStudentById,
  getStydentsByParentId,
  updateStudent,
  deleteStudent,
} = require("../controllers");
const { authenticate, upload } = require("../middlewares");
const router = express.Router();

// Получение всех студентов
router.get("/all", authenticate, getAllStudents);

// Получение студентов по классу
// Параметр :idClass - идентификатор класса
router.get("/class/:idClass", authenticate, getStudentsByClass);

// Получение студента по идентификатору
// Параметр :idStudent - идентификатор студента
router.get("/:idStudent", authenticate, getStudentById);

router.get("/parent/:idParent", authenticate, getStydentsByParentId);

// Обновление студента
// Параметр :idStudent - идентификатор студента
router.put("/:idStudent", authenticate, upload.single('photo'), updateStudent);

// Удаление студента
// Параметр :idStudent - идентификатор студента
router.delete("/:idStudent", authenticate, deleteStudent);

module.exports = router;
