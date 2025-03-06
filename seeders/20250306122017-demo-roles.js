'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Admin', // Роль администратора
      },
      {
        name: 'Teacher', // Роль преподавателя
      },
      {
        name: 'Student', // Роль студента
      },
      {
        name: 'Parent', // Роль родителя
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};