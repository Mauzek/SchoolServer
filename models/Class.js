const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Class extends Model {}
Class.init(
  {
    id_class: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    class_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_letter: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    study_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_employee: {
      type: DataTypes.INTEGER,
      references: {
        model: 'employees',
        key: 'id_employee',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true, // Разрешаем NULL, если классный руководитель не назначен
    },
  },
  {
    sequelize,
    modelName: 'Class',
    tableName: 'classes',
    timestamps: false,
  }
);

module.exports = Class;