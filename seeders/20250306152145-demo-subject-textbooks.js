'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subject_textbooks', [
      {
        id_subject: 1, // Ссылка на предмет "Mathematics"
        name: 'Algebra and Geometry Basics',
        year: 2020,
        authors: 'John Doe, Jane Smith',
        isbn: '978-3-16-148410-0',
        file_link: 'http://example.com/textbooks/mathematics.pdf',
      },
      {
        id_subject: 1, // Другой учебник для "Mathematics"
        name: 'Advanced Calculus',
        year: 2018,
        authors: 'Michael Johnson',
        isbn: '978-1-23-456789-0',
        file_link: 'http://example.com/textbooks/calculus.pdf',
      },
      {
        id_subject: 2, // Учебник для "History"
        name: 'World History: Ancient Civilizations',
        year: 2019,
        authors: 'Alice Brown',
        isbn: '978-2-34-567890-1',
        file_link: 'http://example.com/textbooks/history.pdf',
      },
      {
        id_subject: 3, // Учебник для "Physics"
        name: 'Introduction to Physics',
        year: 2021,
        authors: 'Robert White',
        isbn: '978-4-56-789012-3',
        file_link: 'http://example.com/textbooks/physics.pdf',
      },
      {
        id_subject: 4, // Учебник для "Chemistry"
        name: 'General Chemistry',
        year: 2017,
        authors: 'Emily Green',
        isbn: '978-5-67-890123-4',
        file_link: null, // Файл может отсутствовать
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subject_textbooks', null, {});
  },
};