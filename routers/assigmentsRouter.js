const express = require("express");
const { authenticate, upload, uploadAssignment  } = require("../middlewares");
const {
    createAssignment,
    updateAssignmentById,
    deleteAssignmentById,
    getAssignmentById,
    getAssignmentsByClassId,
    getAssignmentsBySubjectId,
    getAssignmentsBySubjectAndClassId
} = require("../controllers");
const router = express.Router();

// Создание нового задания
router.post("/", authenticate, upload.fields([
    { name: 'assignmentFile', maxCount: 1 },
    { name: 'testingFile', maxCount: 1 }
  ]), createAssignment);
// Обновление задания по ID
router.put("/:idAssignment", authenticate, updateAssignmentById);
// Удаление задания по ID
router.delete("/:idAssignment", authenticate, deleteAssignmentById);
// Получение задания по ID
router.get("/:idAssignment", authenticate, getAssignmentById);
// Получение заданий по ID класса
router.get("/class/:idClass", authenticate, getAssignmentsByClassId);
// Получение заданий по ID предмета
router.get("/subject/:idSubject", authenticate, getAssignmentsBySubjectId);
// Получение заданий по ID класса и предмета
router.get("/class/:idClass/subject/:idSubject", authenticate, getAssignmentsBySubjectAndClassId);

module.exports = router;