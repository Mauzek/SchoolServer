'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('assignment_answers', [
      {
        id_assignment: 1, // Ссылка на задание "Algebra Homework"
        id_student: 1, // Ссылка на студента (например, ID=1 в таблице students)
        grade: 5, // Оценка за ответ
        submission_date: new Date('2025-03-03'), // Дата отправки ответа
        text_answer: 'Solved the quadratic equations as instructed.', // Текстовый ответ
        file_link: 'http://example.com/answers/student1_algebra.pdf', // Ссылка на файл ответа
      },
      {
        id_assignment: 2, // Ссылка на задание "Ancient Civilizations Essay"
        id_student: 1, // Тот же студент
        grade: null, // Оценка ещё не выставлена
        submission_date: new Date('2025-03-10'),
        text_answer: null, // Текстовый ответ отсутствует
        file_link: 'http://example.com/answers/student1_history_essay.pdf',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('assignment_answers', null, {});
  },
};