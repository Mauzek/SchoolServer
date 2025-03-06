const express = require('express');
const apiRouter = express.Router();

const authRouter = require("./authRouter");


// Подключаем все подмаршруты
apiRouter.use("/auth", authRouter);     


module.exports = apiRouter;
