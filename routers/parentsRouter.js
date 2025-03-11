const express = require("express");
const { getAllParents, getParentById, deleteParent, updateParent } = require("../controllers");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

// Получение всех сотрудников
router.get("/all", authenticate, getAllParents);

// Получение родителя по идентификатору
router.get("/:idParent", authenticate, getParentById);

// Обновление родителя
router.put("/:idParent", authenticate, updateParent);

// Удаление родителя
router.delete("/:idParent", authenticate, deleteParent);

module.exports = router;