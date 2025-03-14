const express = require("express");
const { authenticate } = require("../middlewares");
const {
  createAssignmentAnswer,
  createTestingAnswer,
  updateAssignmentAnswer,
  updateTestingAnswerGrade,
  getAssignmentAnswers,
  getTestingAnswers,
  getTestingAnswerById,
  getAssignmentAnswerById,
} = require("../controllers");
const router = express.Router();

// Создание ответа на задание
router.post("/assignment", authenticate, createAssignmentAnswer);
// Создание ответа на тестирование
router.post("/testing", authenticate, createTestingAnswer);
// Обновление ответа на задание
router.put("/assignment/answer/:idAnswer", authenticate, updateAssignmentAnswer);
/// Обновление оценки ответа на тестирование
router.put("/testing/answer/:idTestingAnswer", authenticate, updateTestingAnswerGrade);
// Получение всех ответов на задания 
router.get("/assignment/:idAssignment", authenticate, getAssignmentAnswers);
// Получение всех ответов на тестирование
router.get("/testing/:idTesting", authenticate, getTestingAnswers);
// Получение ответа на задание по ID
router.get("/assignment/answer/:idAnswer", authenticate, getAssignmentAnswerById);
// Получение ответа на тестирование по ID
router.get("/testing/answer/:idTestingAnswer", authenticate, getTestingAnswerById);

module.exports = router;