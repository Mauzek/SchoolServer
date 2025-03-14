const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

class Schedule extends Model {}
Schedule.init({
  id_schedule: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_class: {
    type: DataTypes.INTEGER,
    references: {
      model: 'classes',
      key: 'id_class',
    },
  },
  id_subject: {
    type: DataTypes.INTEGER,
    references: {
      model: 'subjects',
      key: 'id_subject',
    },
  },
  id_employee: {
    type: DataTypes.INTEGER,
    references: {
      model: 'employees',
      key: 'id_employee',
    },
  },
  week_day: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  room_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Schedule',
  tableName: 'schedules',
  timestamps: false,
});

module.exports = Schedule;