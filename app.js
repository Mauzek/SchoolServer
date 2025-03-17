require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require('path');
const fs = require('fs');
const morgan = require("morgan");
const apiRouter = require("./routers/apiRouter");
const { sequelize,connectDB } = require("./database/db");
const {corsMiddleware} = require("./middlewares");

const app = express();

const uploadDir = path.join(__dirname, 'uploads');
const userPhotosDir = path.join(uploadDir, 'userPhotos');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(userPhotosDir)) {
  fs.mkdirSync(userPhotosDir);
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Настройки middleware
app.use(corsMiddleware);  // Используем CORS middleware
app.use(cookieParser());
app.use(express.json());
app.use(morgan("combined"));  // Логирование запросов

// API маршруты
app.use("/api/v1", apiRouter);

// Обработчик 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Ресурс не найден" });
});

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Ошибка при обработке запроса:", err);
  const statusCode = err.status || 500;
  const message = err.message || "Внутренняя ошибка сервера";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })  // Показывать стек ошибок в режиме разработки
  })
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