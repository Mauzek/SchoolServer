'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('testing_answers', [
      {
        id_student: 1, // Ссылка на другого студента
        id_testing: 2, // Ссылка на тест "Physics Test"
        grade: 2, // Оценка за тест
        submission_date: new Date('2025-03-03'),
        file_link: 'http://example.com/testing_answers/student1_physics_test.json',
      },
      {
        id_student: 1, // Ссылка на третьего студента
        id_testing: 2, // Ссылка на тест "Chemistry Test"
        grade: null, // Оценка ещё не выставлена
        submission_date: new Date('2025-03-05'),
        file_link: 'http://example.com/testing_answers/student1_chemistry_test.json',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('testing_answers', null, {});
  },
};