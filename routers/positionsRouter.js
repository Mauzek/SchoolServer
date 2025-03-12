const express = require("express");
const { authenticate } = require("../middlewares");
const {
  createPosition,
  deletePositionById,
  updatePositionById,
  getAllPositions,
} = require("../controllers");
const router = express.Router();

// Получение всех должностей
router.get("/all", authenticate, getAllPositions);
// Создание новой должности
router.post("/", authenticate, createPosition);
// Обновление должности по идентификатору
router.put("/:idPosition", authenticate, updatePositionById);
// Удаление должности по идентификатору
router.delete("/:idPosition", authenticate, deletePositionById);

module.exports = router;
