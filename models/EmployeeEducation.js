// models/EmployeeEducation.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class EmployeeEducation extends Model {}
EmployeeEducation.init({
  id_employee_education: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_employee: {
    type: DataTypes.INTEGER,
    references: {
      model: 'employees',
      key: 'id_employee',
    },
  },
  id_education_level: {
    type: DataTypes.INTEGER,
    references: {
      model: 'education_levels',
      key: 'id_education_level',
    },
  },
  id_educational_institution: {
    type: DataTypes.INTEGER,
    references: {
      model: 'educational_institutions',
      key: 'id_educational_institution',
    },
  },
  id_specialty: {
    type: DataTypes.INTEGER,
    references: {
      model: 'specialties',
      key: 'id_specialty',
    },
  },
  graduation_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'EmployeeEducation',
  tableName: 'employee_educations',
  timestamps: false,
});

module.exports = EmployeeEducation;