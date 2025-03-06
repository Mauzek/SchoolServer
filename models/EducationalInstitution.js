// models/EducationalInstitution.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class EducationalInstitution extends Model {}
EducationalInstitution.init({
  id_educational_institution: {
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
  modelName: 'EducationalInstitution',
  tableName: 'educational_institutions',
  timestamps: false,
});

module.exports = EducationalInstitution;