'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('positions', [
      {
        name: 'Teacher', // Название должности
        description: 'Отвечает за обучение студентов и подготовку планов уроков.', // Описание
      },
      {
        name: 'Administrator',
        description: 'Управляет школой и контролирует все операции.',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('positions', null, {});
  },
};