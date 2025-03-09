const express = require("express");
const { login, register, refreshAccessToken } = require("../controllers");
const router = express.Router();

// Регистрация
router.post("/register", register);

// Обновление токена
router.post("/refreshToken", refreshAccessToken);

// Логин
router.post("/login", login);


module.exports = router;
