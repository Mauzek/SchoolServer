'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('students', [
      {
        id_user: 3, // Ссылка на пользователя "Student" (id_user из таблицы users)
        id_class: 1, // Ссылка на класс (например, класс с ID=1)
        phone: '+1234567890',
        birth_date: new Date('2005-05-15'), // Дата рождения
        document_number: 'AB1234567', // Номер документа
        blood_group: 'A+', // Группа крови (необязательное поле)
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('students', null, {});
  },
};