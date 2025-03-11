const express = require('express');
const apiRouter = express.Router();
const authRouter = require("./authRouter");
const studentRouter = require("./studentsRouter");
const gradeRouter = require("./gradesRouter");
const employeeRouter = require("./employeesRouter");
const parentRouter = require("./parentsRouter");

// Подключаем все подмаршруты
apiRouter.use("/auth", authRouter);     

apiRouter.use("/students", studentRouter);

apiRouter.use("/grades", gradeRouter);

apiRouter.use("/employees", employeeRouter);

apiRouter.use("/parents", parentRouter);

module.exports = apiRouter;
