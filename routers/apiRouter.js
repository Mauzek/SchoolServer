const express = require('express');
const apiRouter = express.Router();
const authRouter = require("./authRouter");
const studentRouter = require("./studentsRouter");
const gradeRouter = require("./gradesRouter");

// Подключаем все подмаршруты
apiRouter.use("/auth", authRouter);     

apiRouter.use("/students", studentRouter);

apiRouter.use("/grades", gradeRouter);

module.exports = apiRouter;
