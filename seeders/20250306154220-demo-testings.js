'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('testings', [
      {
        id_assignment: 3, // Ссылка на задание "Newton's Laws Experiment"
        file_link: 'http://example.com/testings/physics_test.json',
        attempts_count: 1,
      },
      {
        id_assignment: 4, // Ссылка на задание "Chemical Reactions Lab"
        file_link: 'http://example.com/testings/chemistry_test.json',
        attempts_count: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('testings', null, {});
  },
};