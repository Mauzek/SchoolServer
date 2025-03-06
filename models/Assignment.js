// models/Assignment.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Assignment extends Model {}
Assignment.init({
  id_assignment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_subject: {
    type: DataTypes.INTEGER,
    references: {
      model: 'subjects',
      key: 'id_subject',
    },
  },
  id_class: {
    type: DataTypes.INTEGER,
    references: {
      model: 'classes',
      key: 'id_class',
    },
  },
  id_employee: {
    type: DataTypes.INTEGER,
    references: {
      model: 'employees',
      key: 'id_employee',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  file_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  open_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  close_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Assignment',
  tableName: 'assignments',
  timestamps: false,
});

module.exports = Assignment;