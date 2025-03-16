const express = require("express");
const { login, register, refreshAccessToken, loginWithJWT } = require("../controllers");
const router = express.Router();

// Регистрация
router.post("/register", register);

// Обновление токена
router.post("/refreshToken", refreshAccessToken);

// Логин
router.post("/login", login);

// Логин с JWT
router.post("/", loginWithJWT);


module.exports = router;
