'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('educational_institutions', [
      {
        name: 'Harvard University', // Название учебного заведения
      },
      {
        name: 'Stanford University',
      },
      {
        name: 'Massachusetts Institute of Technology (MIT)',
      },
      {
        name: 'California State University',
      },
      {
        name: 'Local Community College',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('educational_institutions', null, {});
  },
};