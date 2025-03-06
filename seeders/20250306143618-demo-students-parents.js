'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('student_parents', [
      {
        id_parent: 1, // Ссылка на родителя (id_parent из таблицы parents)
        id_student: 1, // Ссылка на студента (id_student из таблицы students)
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('student_parents', null, {});
  },
};