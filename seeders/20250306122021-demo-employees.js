'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employees', [
      {
        id_user: 1, // Ссылка на пользователя "Admin" (id_user из таблицы users)
        id_position: 1, // Ссылка на должность (например, ID=1 в таблице positions)
        marital_status: 'Married',
        birth_date: new Date('1985-03-10'), // Дата рождения
        phone: '+1234567890',
        is_staff: true,
        passport_series: 'AB1234',
        passport_number: '567890',
        work_book_number: 'WB123456',
        registration_address: '123 Teacher St., City, Country',
        work_experience: 10, // Опыт работы в годах
        hire_date: new Date('2013-09-01'), // Дата найма
      },
      {
        id_user: 2, // Другой пользователь-сотрудник
        id_position: 2, // Ссылка на другую должность Teacher
        marital_status: 'Single',
        birth_date: new Date('1990-07-25'),
        phone: '+0987654321',
        is_staff: true,
        passport_series: 'CD5678',
        passport_number: '123456',
        work_book_number: 'WB654321',
        registration_address: '456 Staff Ave., City, Country',
        work_experience: 5,
        hire_date: new Date('2018-08-15'),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employees', null, {});
  },
};