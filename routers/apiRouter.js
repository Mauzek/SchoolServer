const express = require('express');
const apiRouter = express.Router();
const authRouter = require("./authRouter");
const studentRouter = require("./studentsRouter");
const gradeRouter = require("./gradesRouter");
const employeeRouter = require("./employeesRouter");
const parentRouter = require("./parentsRouter");
const roleRouter = require("./rolesRouter");
const educationalRouter = require("./employeesEducationRouter");
const educationLevelRouter = require("./educationalLevelRouter");
const educationalInstitutionRouter = require("./educationalInstitutionRouter");
const educationalSpecialtyRouter = require("./educationalSpecialtyRouter");
const positionRouter = require("./positionsRouter");
const subjectRouter = require("./subjectsRouter");
const subjectTextbooksRouter = require("./subjectTextbooksRouter");
const classRouter = require("./classesRouter");
const scheduleRouter = require("./schedulesRouter");
const assigmentRouter = require("./assigmentsRouter");
const answerRouter = require("./answersRouter");
const с = require("./statisticsRouter");

// <---------Подключаем все подмаршруты--------->

// Подмаршруты для аутентификации и регистрации
apiRouter.use("/auth", authRouter);    

// Подмаршруты для студентов
apiRouter.use("/students", studentRouter);

// Подмаршруты для оценок
apiRouter.use("/grades", gradeRouter);

// Подмаршруты для сотрудников
apiRouter.use("/employees", employeeRouter);

// Подмаршруты для родителей
apiRouter.use("/parents", parentRouter);

/// Подмаршруты для ролей
apiRouter.use("/roles", roleRouter);

// Подмаршруты для образования
apiRouter.use("/education", educationalRouter);

// Подмаршруты для уровней образования
apiRouter.use("/education/levels", educationLevelRouter);

// Подмаршруты для учебных заведений
apiRouter.use("/education/institutions", educationalInstitutionRouter);

// Подмаршруты для специальностей образования
apiRouter.use("/education/specialties", educationalSpecialtyRouter);

// Подмаршруты для должностей
apiRouter.use("/positions", positionRouter);

// Подмаршруты для предметов
apiRouter.use("/subjects", subjectRouter);

// Подмаршруты для учебных пособий
apiRouter.use("/textbooks", subjectTextbooksRouter);

// Подмаршруты для классов
apiRouter.use("/classes", classRouter);

// Подмаршруты для расписаний
apiRouter.use("/schedules", scheduleRouter);

// Подмаршруты для заданий
apiRouter.use("/assignments", assigmentRouter);

// Подмаршруты для ответов
apiRouter.use("/answers", answerRouter);

// Подмаршруты для статистики
apiRouter.use("/statistics", с);

module.exports = apiRouter;
