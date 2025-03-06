'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employee_educations', [
      {
        id_employee: 1, // Ссылка на сотрудника (id_employee из таблицы employees)
        id_education_level: 1, // Ссылка на уровень образования (например, ID=1 в таблице education_levels)
        id_educational_institution: 1, // Ссылка на учебное заведение
        id_specialty: 1, // Ссылка на специальность
        graduation_year: 2010, // Год окончания
      },
      {
        id_employee: 2, // Другой сотрудник
        id_education_level: 2, // Другой уровень образования
        id_educational_institution: 2, // Другое учебное заведение
        id_specialty: 2, // Другая специальность
        graduation_year: 2015,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employee_educations', null, {});
  },
};