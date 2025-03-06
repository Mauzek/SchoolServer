'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('grades', [
      {
        id_student: 1, // Ссылка на студента (например, ID=1 в таблице students)
        id_subject: 1, // Ссылка на предмет "Mathematics"
        grade_value: 4, // Оценка
        grade_date: new Date('2023-10-01'), // Дата оценки
        grade_type: 'Test', // Тип оценки (например, "Test", "Homework", "Exam")
        description: 'Good understanding of algebra concepts.', // Описание
      },
      {
        id_student: 1, // Тот же студент
        id_subject: 2, // Ссылка на предмет "History"
        grade_value: 3,
        grade_date: new Date('2023-10-05'),
        grade_type: 'Homework',
        description: 'Needs improvement in essay structure.', // Описание
      },
      {
        id_student: 1, // Другой студент
        id_subject: 3, // Ссылка на предмет "Physics"
        grade_value: 5,
        grade_date: new Date('2023-10-03'),
        grade_type: 'Exam',
        description: 'Excellent performance on the physics exam.', // Описание
      },
      {
        id_student: 1, // Третий студент
        id_subject: 4, // Ссылка на предмет "Chemistry"
        grade_value: 2,
        grade_date: new Date('2023-10-07'),
        grade_type: 'Test',
        description: null, // Описание может отсутствовать
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('grades', null, {});
  },
};