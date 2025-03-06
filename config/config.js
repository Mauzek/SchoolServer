const path = require('path');

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    seederStorage: 'sequelize', // Хранение состояния seeders в БД
    seederStorageTableName: 'SequelizeSeeders', // Таблица для seeders
    seedersPath: path.resolve(__dirname, '../database/seeders'),
    dialectOptions: {
      charset: 'utf8', // Установите кодировку UTF-8
    }, // Абсолютный путь к seeders
  },
};