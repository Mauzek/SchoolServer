const express = require("express");
const { 
    getGradesByClass, 
    getGradesByClassAndSubject, 
    getGradesByStudent,
    createGrade,
    updateGrade,
    deleteGrade } = require("../controllers");
const { authenticate } = require("../middleware");
const router = express.Router();

// Получение всех оценок по классу
router.get("/class/:idClass", authenticate, getGradesByClass);

// Получение всех оценок по классу и предмету
router.get("/class/:idClass/subject/:idSubject", authenticate, getGradesByClassAndSubject);

// Получение всех оценок по студенту
router.get("/student/:idStudent", authenticate, getGradesByStudent);

// Создание новой оценки
router.post("/", authenticate, createGrade);

// Обновление оценки
router.put("/:idGrade", authenticate, updateGrade);

// Удаление оценки
router.delete("/:idGrade", authenticate, deleteGrade);

module.exports = router;