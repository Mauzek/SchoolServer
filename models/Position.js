// models/Position.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Position extends Model {}
Position.init({
  id_position: {
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
  modelName: 'Position',
  tableName: 'positions',
  timestamps: false,
});

module.exports = Position;