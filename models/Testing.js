// models/Testing.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Testing extends Model {}
Testing.init({
  id_testing: {
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
  file_link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  attempts_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  sequelize,
  modelName: 'Testing',
  tableName: 'testings',
  timestamps: false,
});

module.exports = Testing;