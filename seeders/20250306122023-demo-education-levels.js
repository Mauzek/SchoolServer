'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('education_levels', [
      {
        name: 'Бакалавр', // Название уровня образования
      },
      {
        name: 'Магистр',
      },
      {
        name: 'Доктор наук',
      },
      {
        name: 'Специалист',
      },
      {
        name: 'Аспирант',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('education_levels', null, {});
  },
};