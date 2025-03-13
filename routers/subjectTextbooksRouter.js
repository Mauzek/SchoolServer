const express = require("express");
const { authenticate } = require("../middlewares");
const {
    createTextbook,
    updateTextbookById,
    deleteTextbookById,
    getTextbooksBySubject,
    getTextbooksByName,
    getTextbookById,
    getAllTextbooks,
    getTextbooksByISBN
} = require("../controllers");
const router = express.Router();

// Получить все учебные пособия
router.get("/all", authenticate, getAllTextbooks);
// Получить учебные пособия по ID
router.get("/:idTextbook", authenticate, getTextbookById);
// Получить учебные пособия по названию
router.get("/name/:name", authenticate, getTextbooksByName);
// Получить учебные пособия по ID предмета
router.get("/subject/:idSubject", authenticate, getTextbooksBySubject);
// Получить учебные пособия по ISBN
router.get("/isbn/:isbn", authenticate, getTextbooksByISBN);
// Создать новое учебное пособие
router.post("/", authenticate, createTextbook);
// Обновить учебное пособие по ID
router.put("/:idTextbook", authenticate, updateTextbookById);
// Удалить учебное пособие по ID
router.delete("/:idTextbook", authenticate, deleteTextbookById);

module.exports = router;