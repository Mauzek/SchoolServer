require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require('path');
const fs = require('fs');
const morgan = require("morgan");
const apiRouter = require("./routers/apiRouter");
const { sequelize, connectDB } = require("./database/db");
const { corsMiddleware } = require("./middlewares");

const app = express();

const uploadDir = path.join(__dirname, 'uploads');
const userPhotosDir = path.join(uploadDir, 'userPhotos');
const assignmentsFilesDir = path.join(uploadDir, 'assignmentsFiles'); // Директория для файлов заданий
const testingFilesDir = path.join(uploadDir, 'testingFiles'); // Директория для файлов заданий
const textbooksFilesDir = path.join(uploadDir, 'Textbooks'); // Директория для файлов тестирования
const answersDir = path.join(uploadDir, 'answers'); // Директория для ответов

// Создаём директории, если они не существуют
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(userPhotosDir)) {
  fs.mkdirSync(userPhotosDir);
}

if (!fs.existsSync(assignmentsFilesDir)) {
  fs.mkdirSync(assignmentsFilesDir);
}

if (!fs.existsSync(testingFilesDir)) {
  fs.mkdirSync(testingFilesDir);
}

if (!fs.existsSync(textbooksFilesDir)) {
  fs.mkdirSync(textbooksFilesDir);
}

if (!fs.existsSync(answersDir)) {
  fs.mkdirSync(answersDir);
}

// Настраиваем статическую раздачу файлов
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );
    },
  })
);

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