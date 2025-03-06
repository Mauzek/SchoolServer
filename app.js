require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const apiRouter = require("./routers/apiRouter");
const { sequelize, connectDB } = require("./database/db");
const { 
  User, 
  Role, 
  Parent, 
  Student,
  Employee,
  Position,
  Class,
  Subject,
  Schedule,
  Grade,
  Assignment,
  Testing
} = require("./models");

const app = express();

// Настройки middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("combined"));

// Главная страница
app.get("/", (req, res) => {
  res.send("Сервер образовательной системы v1.0");
});

// API маршруты
app.use("/api/v1", apiRouter);

// Обработчик 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Ресурс не найден" });
});

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Ошибка при обработке запроса:", err);
  res.status(err.status || 500).json({
    error: err.message || "Внутренняя ошибка сервера"
  });
});

// Запуск сервера
const startServer = async () => {
  try {
    // Подключение к БД
    await connectDB();
    
    // Синхронизация моделей
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log("⚠️ Режим разработки: структура БД обновлена");
    } else {
      await sequelize.authenticate();
      console.log("✅ Подключение к БД успешно");
    }

    // Запуск сервера
    const server = app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Сервер запущен на порту ${process.env.PORT || 3000}`);
    });

    // Грейсфул шатдаун
    process.on('SIGINT', async () => {
      console.log("⏳ Получен сигнал SIGINT. Завершение работы...");
      await sequelize.close();
      server.close(() => {
        console.log("✅ Сервер остановлен корректно");
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Критическая ошибка:", error);
    process.exit(1);
  }
};

startServer();