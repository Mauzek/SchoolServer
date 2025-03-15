const express = require("express");
const { authenticate } = require("../middlewares");
const {
    getAverageGradesByClass,
    getAverageGradesByStudent,
    getAverageGradesBySubject,
    getGradeDistributionByClass,
    getGradeDistributionByStudent,
    getGradeDistributionBySubject,
} = require("../controllers");
const router = express.Router();

// Получение средних оценок по классу
router.get("/average-grades-by-class", authenticate, getAverageGradesByClass);
// Получение средних оценок по ученику
router.get("/average-grades-by-student", authenticate, getAverageGradesByStudent);
// Получение средних оценок по предмету
router.get("/average-grades-by-subject", authenticate, getAverageGradesBySubject);
// Получение распределения оценок по классу
router.get("/grade-distribution-by-class", authenticate, getGradeDistributionByClass);
// Получение распределения оценок по ученику
router.get("/grade-distribution-by-student", authenticate, getGradeDistributionByStudent);
// Получение распределения оценок по предмету
router.get("/grade-distribution-by-subject", authenticate, getGradeDistributionBySubject);


module.exports = router;