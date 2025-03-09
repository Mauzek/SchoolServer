const express = require('express');
const apiRouter = express.Router();
const authRouter = require("./authRouter");
const studentRouter = require("./studentsRouter");

// Подключаем все подмаршруты
apiRouter.use("/auth", authRouter);     

apiRouter.use("/data", studentRouter);

module.exports = apiRouter;
