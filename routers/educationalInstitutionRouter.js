const express = require("express");
const { authenticate } = require("../middlewares");
const {
    createEducationalInstitution,
    updateEducationalInstitutionById,
    deleteEducationalInstitutionById,
    getAllEducationalInstitutions,
} = require("../controllers");
const router = express.Router();

// Получение всех учебных заведений
router.get("/all", authenticate, getAllEducationalInstitutions);
// Создание нового учебного заведения
router.post("/", authenticate, createEducationalInstitution);
// Обновление учебного заведения по идентификатору
router.put("/:idEducationalInstitution", authenticate, updateEducationalInstitutionById);
// Удаление учебного заведения по идентификатору
router.delete("/:idEducationalInstitution", authenticate, deleteEducationalInstitutionById);

module.exports = router;