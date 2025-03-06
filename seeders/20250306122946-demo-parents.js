'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('parents', [
      {
        id_user: 4, // Ссылка на пользователя "Parent" (id_user из таблицы users)
        parent_type: 'Father',
        phone: '+1122334455',
        work_phone: null, 
        workplace: 'Tech Company',
        position: 'Engineer',
        children_count: 1,
        passport_series: 'CD5678',
        passport_number: '123456',
        registration_address: '456 Family Ave., City, Country',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('parents', null, {});
  },
};