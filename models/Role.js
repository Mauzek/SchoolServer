// models/Role.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Role extends Model {}
Role.init({
  id_role: {
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
  modelName: 'Role',
  tableName: 'roles',
  timestamps: false,
});

module.exports = Role;