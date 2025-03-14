const express = require("express");
const {
  createSchedule,
  deleteScheduleById,
  updateScheduleById,
  getScheduleByClass,
  getScheduleByEmployee,
  getClassScheduleByWeekInterval,
  getEmployeeScheduleByWeekInterval,
} = require("../controllers/scheduleController");
const { authenticate } = require("../middlewares");
const router = express.Router();

// Создание расписания
router.post("/", authenticate, createSchedule);

// Удаление расписания по идентификатору
// Параметр :idSchedule - идентификатор расписания
router.delete("/:idSchedule", authenticate, deleteScheduleById);

// Обновление расписания по идентификатору
// Параметр :idSchedule - идентификатор расписания
router.put("/:idSchedule", authenticate, updateScheduleById);

// Получение расписания по классу
// Параметр :idClass - идентификатор класса
router.get("/class/:idClass", authenticate, getScheduleByClass);

// Получение расписания по сотруднику
// Параметр :idEmployee - идентификатор сотрудника
router.get("/employee/:idEmployee", authenticate, getScheduleByEmployee);

// Получение расписания класса по промежутку недели
// Параметры :idClass, :startDate, :endDate - идентификатор класса и промежуток недели
router.get("/class/:idClass/week/:startDate/:endDate", authenticate, getClassScheduleByWeekInterval);

// Получение расписания сотрудника по промежутку недели
// Параметры :idEmployee, :startDate, :endDate - идентификатор сотрудника и промежуток недели
router.get("/employee/:idEmployee/week/:startDate/:endDate", authenticate, getEmployeeScheduleByWeekInterval);

module.exports = router;