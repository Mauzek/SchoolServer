// models/SubjectTextbook.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class SubjectTextbook extends Model {}
SubjectTextbook.init({
  id_subject_textbook: {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  authors: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  file_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'SubjectTextbook',
  tableName: 'subject_textbooks',
  timestamps: false,
});

module.exports = SubjectTextbook;