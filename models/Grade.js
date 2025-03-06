// models/Grade.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Grade extends Model {}
Grade.init({
  id_grade: {
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
  id_subject: {
    type: DataTypes.INTEGER,
    references: {
      model: 'subjects',
      key: 'id_subject',
    },
  },
  grade_value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  grade_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  grade_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Grade',
  tableName: 'grades',
  timestamps: false,
});

module.exports = Grade;