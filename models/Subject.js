// models/Subject.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Subject extends Model {}
Subject.init({
  id_subject: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Subject',
  tableName: 'subjects',
  timestamps: false,
});

module.exports = Subject;