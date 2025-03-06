'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('assignments', [
      {
        id_subject: 1, // Ссылка на предмет "Mathematics"
        id_class: 1, // Ссылка на класс (например, 9A)
        id_employee: 1, // Ссылка на преподавателя
        title: 'Algebra Homework', // Название задания
        description: 'Solve the quadratic equations from Chapter 5.', // Описание
        file_link: 'http://example.com/assignments/math_homework.pdf', // Ссылка на файл
        created_at: new Date(), // Дата создания
        open_time: new Date('2025-03-01'), // Время открытия задания
        close_time: new Date('2025-03-08'), // Время закрытия задания
      },
      {
        id_subject: 2, // Ссылка на предмет "History"
        id_class: 1, // Тот же класс
        id_employee: 2, // Ссылка на другого преподавателя
        title: 'Ancient Civilizations Essay',
        description: 'Write an essay about the impact of ancient civilizations on modern society.',
        file_link: null, // Файл может отсутствовать
        created_at: new Date(),
        open_time: new Date('2025-03-01'),
        close_time: new Date('2025-03-31'),
      },
      {
        id_subject: 3, // Ссылка на предмет "Physics"
        id_class: 2, // Ссылка на другой класс (например, 10B)
        id_employee: 1, // Ссылка на преподавателя
        title: 'Newton\'s Laws Experiment',
        description: 'Conduct an experiment to demonstrate Newton\'s laws of motion.',
        file_link: 'http://example.com/assignments/physics_experiment.pdf',
        created_at: new Date(),
        open_time: new Date('2025-03-01'),
        close_time: new Date('2025-03-20'),
      },
      {
        id_subject: 4, // Ссылка на предмет "Chemistry"
        id_class: 3, // Ссылка на класс 11C
        id_employee: 1, // Преподаватель может давать задания по разным предметам
        title: 'Chemical Reactions Lab',
        description: 'Perform the chemical reactions described in the lab manual.',
        file_link: null,
        created_at: new Date(),
        open_time: new Date('2025-03-01'),
        close_time: new Date('2025-03-10'),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('assignments', null, {});
  },
};