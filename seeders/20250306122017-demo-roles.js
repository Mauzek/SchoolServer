'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Админ', // Роль администратора
      },
      {
        name: 'Учитель', // Роль преподавателя
      },
      {
        name: 'Ученик', // Роль студента
      },
      {
        name: 'Родитель', // Роль родителя
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};

