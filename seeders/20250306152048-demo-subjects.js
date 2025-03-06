'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subjects', [
      {
        name: 'Mathematics', // Название предмета
        description: 'The study of numbers, quantities, and shapes.', // Описание
      },
      {
        name: 'History',
        description: 'The study of past events and human civilization.',
      },
      {
        name: 'Physics',
        description: 'The study of matter, energy, and the interactions between them.',
      },
      {
        name: 'Chemistry',
        description: 'The study of substances, their properties, and reactions.',
      },
      {
        name: 'Biology',
        description: 'The study of living organisms and life processes.',
      },
      {
        name: 'Literature',
        description: 'The study of written works, especially fiction and poetry.',
      },
      {
        name: 'Geography',
        description: 'The study of Earth\'s landscapes, environments, and populations.',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subjects', null, {});
  },
};