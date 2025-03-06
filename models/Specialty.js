// models/Specialty.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Specialty extends Model {}
Specialty.init({
  id_specialty: {
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
  modelName: 'Specialty',
  tableName: 'specialties',
  timestamps: false,
});

module.exports = Specialty;