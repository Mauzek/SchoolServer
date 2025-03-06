// models/Student.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Student extends Model {}
Student.init({
  id_student: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: 'users',
      key: 'id_user',
    },
  },
  id_class: {
    type: DataTypes.INTEGER,
    references: {
      model: 'classes',
      key: 'id_class',
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  document_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  blood_group: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Student',
  tableName: 'students',
  timestamps: false,
});

module.exports = Student;