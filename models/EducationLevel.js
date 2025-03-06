// models/EducationLevel.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class EducationLevel extends Model {}
EducationLevel.init({
  id_education_level: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'EducationLevel',
  tableName: 'education_levels',
  timestamps: false,
});

module.exports = EducationLevel;