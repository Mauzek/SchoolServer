'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('classes', [
      {
        class_number: 9, // Номер класса
        class_letter: 'A', // Буква класса
        study_year: 2025, // Учебный год
        id_employee: 2, // Классный руководитель
      },
      {
        class_number: 10,
        class_letter: 'B',
        study_year: 2025,
        id_employee: 2, // Классный руководитель
      },
      {
        class_number: 11,
        class_letter: 'C',
        study_year: 2025,
        id_employee: null, // Классный руководитель
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('classes', null, {});
  },
};