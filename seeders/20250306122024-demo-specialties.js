'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('specialties', [
      {
        name: 'Computer Science', // Название специальности
      },
      {
        name: 'Mathematics',
      },
      {
        name: 'Biology',
      },
      {
        name: 'Physics',
      },
      {
        name: 'Chemistry',
      },
      {
        name: 'History',
      },
      {
        name: 'Economics',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('specialties', null, {});
  },
};