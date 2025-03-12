const express = require("express");
const { authenticate } = require("../middlewares");
const {
    createSpecialty,
    updateSpecialtyById,
    deleteSpecialtyById,
    getAllSpecialties,
} = require("../controllers");
const router = express.Router();

// Получение всех специальностей
router.get("/all", authenticate, getAllSpecialties);
// Создание новой специальности
router.post("/", authenticate, createSpecialty);
// Обновление специальности по идентификатору
router.put("/:idSpecialty", authenticate, updateSpecialtyById);
// Удаление специальности по идентификатору
router.delete("/:idSpecialty", authenticate, deleteSpecialtyById);

module.exports = router;