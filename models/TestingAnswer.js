// models/TestingAnswer.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class TestingAnswer extends Model {}
TestingAnswer.init({
  id_testing_answer: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_student: {
    type: DataTypes.INTEGER,
    references: {
      model: 'students',
      key: 'id_student',
    },
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  submission_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  file_link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'TestingAnswer',
  tableName: 'testing_answers',
  timestamps: false,
});

module.exports = TestingAnswer;