// models/AssignmentAnswer.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class AssignmentAnswer extends Model {}
AssignmentAnswer.init({
  id_answer: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_assignment: {
    type: DataTypes.INTEGER,
    references: {
      model: 'assignments',
      key: 'id_assignment',
    },
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
  text_answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  file_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'AssignmentAnswer',
  tableName: 'assignment_answers',
  timestamps: false,
});

module.exports = AssignmentAnswer;