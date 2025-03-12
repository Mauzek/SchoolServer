const express = require("express");
const { authenticate } = require("../middlewares");
const {
    getAllEducationLevels,
    createEducationLevel,
    updateEducationLevelById,
    deleteEducationLevelById,
} = require("../controllers");
const router = express.Router();

// Получение всех уровней образования
router.get("/all", authenticate, getAllEducationLevels);
// Создание нового уровня образования
router.post("/", authenticate, createEducationLevel);
// Обновление уровня образования по идентификатору
router.put("/:idEducationLevel", authenticate, updateEducationLevelById);
// Удаление уровня образования по идентификатору
router.delete("/:idEducationLevel", authenticate, deleteEducationLevelById);

module.exports = router;