const express = require("express");
const { login, register, refreshAccessToken, loginWithJWT, updateUserAvatar } = require("../controllers");
const { upload, authenticate } = require("../middlewares");
const router = express.Router();

// Регистрация
router.post("/register",upload.single('photo'), register);

// Обновление токена
router.post("/refreshToken", refreshAccessToken);

// Логин
router.post("/login", login);

// Логин с JWT
router.post("/", loginWithJWT);

router.post("/updateAvatar", authenticate, upload.single('photo'), updateUserAvatar);


module.exports = router;
