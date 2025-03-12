const express = require("express");
const { authenticate } = require("../middlewares");
const {
    createSubject,
    updateSubjectById,
    deleteSubjectById,
    getAllSubjects,
} = require("../controllers");
const router = express.Router();

// Получение всех предметов
router.get("/all", authenticate, getAllSubjects);
// Создание нового предмета
router.post("/", authenticate, createSubject);
// Обновление предмета по идентификатору
router.put("/:idSubject", authenticate, updateSubjectById);
// Удаление предмета по идентификатору  
router.delete("/:idSubject", authenticate, deleteSubjectById);


module.exports = router;