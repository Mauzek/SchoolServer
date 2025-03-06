// models/Parent.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Parent extends Model {}
Parent.init({
  id_parent: {
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
  parent_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  work_phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  workplace: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  children_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  passport_series: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passport_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  registration_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Parent',
  tableName: 'parents',
  timestamps: false,
});

module.exports = Parent;