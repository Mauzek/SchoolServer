// models/StudentParent.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class StudentParent extends Model {}
StudentParent.init({
  id_parent: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'parents',
      key: 'id_parent',
    },
  },
  id_student: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'students',
      key: 'id_student',
    },
  },
}, {
  sequelize,
  modelName: 'StudentParent',
  tableName: 'student_parents',
  timestamps: false,
});

module.exports = StudentParent;