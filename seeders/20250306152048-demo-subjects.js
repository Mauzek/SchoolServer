'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subjects', [
      {
        name: 'Математика', // Название предмета
        description: 'Изучение чисел, величин и форм.', // Описание
      },
      {
        name: 'История',
        description: 'Изучение прошлых событий и человеческой цивилизации.',
      },
      {
        name: 'Физика',
        description: 'Изучение материи, энергии и взаимодействий между ними.',
      },
      {
        name: 'Химия',
        description: 'Изучение веществ, их свойств и реакций.',
      },
      {
        name: 'Биология',
        description: 'Изучение живых организмов и жизненных процессов.',
      },
      {
        name: 'Литература',
        description: 'Изучение письменных произведений, особенно художественной литературы и поэзии.',
      },
      {
        name: 'География',
        description: 'Изучение ландшафтов Земли, окружающей среды и населения.',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subjects', null, {});
  },
};
