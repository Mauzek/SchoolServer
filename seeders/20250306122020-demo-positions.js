'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('positions', [
      {
        name: 'Teacher', // Название должности
        description: 'Responsible for teaching students and preparing lesson plans.', // Описание
      },
      {
        name: 'Administrator',
        description: 'Manages the school and oversees all operations.',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('positions', null, {});
  },
};