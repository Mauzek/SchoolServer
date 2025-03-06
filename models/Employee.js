// models/Employee.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Employee extends Model {}
Employee.init({
  id_employee: {
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
  id_position: {
    type: DataTypes.INTEGER,
    references: {
      model: 'positions',
      key: 'id_position',
    },
  },
  marital_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_staff: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  passport_series: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passport_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  work_book_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  registration_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  work_experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hire_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Employee',
  tableName: 'employees',
  timestamps: false,
});

module.exports = Employee;