// SchoolServer/database/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,  // Указываем порт из .env
  dialect: "postgres",
  logging: false, // Отключаем логи SQL в консоли
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Подключение к базе данных успешно!");
  } catch (error) {
    console.error("❌ Ошибка подключения к БД:", error);
    process.exit(1); // Завершаем процесс, если не удалось подключиться
  }
}

module.exports = { sequelize, connectDB };
