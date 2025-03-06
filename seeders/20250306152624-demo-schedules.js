'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('schedules', [
      {
        id_class: 1, // Ссылка на класс (например, 9A)
        id_subject: 1, // Ссылка на предмет "Mathematics"
        id_employee: 1, // Ссылка на преподавателя
        week_day: 'Monday', // День недели
        start_time: '08:00:00', // Время начала
        end_time: '09:30:00', // Время окончания
        room_number: '101', // Номер аудитории
      },
      {
        id_class: 1, // Тот же класс
        id_subject: 2, // Ссылка на предмет "History"
        id_employee: 2, // Ссылка на другого преподавателя
        week_day: 'Tuesday',
        start_time: '10:00:00',
        end_time: '11:30:00',
        room_number: '202',
      },
      {
        id_class: 2, // Другой класс (например, 10B)
        id_subject: 3, // Ссылка на предмет "Physics"
        id_employee: 1, // Ссылка на преподавателя
        week_day: 'Wednesday',
        start_time: '13:00:00',
        end_time: '14:30:00',
        room_number: '303',
      },
      {
        id_class: 3, // Класс 11C
        id_subject: 4, // Ссылка на предмет "Chemistry"
        id_employee: 2  , // Преподаватель может вести разные предметы
        week_day: 'Thursday',
        start_time: '15:00:00',
        end_time: '16:30:00',
        room_number: '404',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('schedules', null, {});
  },
};