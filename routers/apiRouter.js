const express = require('express');
const apiRouter = express.Router();
const authRouter = require("./authRouter");
const studentRouter = require("./studentsRouter");
const gradeRouter = require("./gradesRouter");
const employeeRouter = require("./employeesRouter");
const parentRouter = require("./parentsRouter");
const roleRouter = require("./rolesRouter");

// Подключаем все подмаршруты
apiRouter.use("/auth", authRouter);     

apiRouter.use("/students", studentRouter);

apiRouter.use("/grades", gradeRouter);

apiRouter.use("/employees", employeeRouter);

apiRouter.use("/parents", parentRouter);

apiRouter.use("/roles", roleRouter);

module.exports = apiRouter;
