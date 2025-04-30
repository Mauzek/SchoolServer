'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const adminPassword = await bcrypt.hash('password123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const parentPassword = await bcrypt.hash('parent123', 10);

    const users = [];
    
    // Базовые пользователи (админ и учитель)
    users.push({
      id_role: 1,
      gender: 'male',
      email: 'admin@example.com',
      login: 'admin',
      password: adminPassword,
      last_name: 'Иллий',
      first_name: 'Артём',
      middle_name: 'Андреевич',
      photo: null,
    });
    
    users.push({
      id_role: 2,
      gender: 'female',
      email: 'teacher@example.com',
      login: 'teacher',
      password: teacherPassword,
      last_name: 'Иванова',
      first_name: 'Екатерина',
      middle_name: 'Иванновна',
      photo: null,
    });

    // 5 студентов
    const studentLastNames = ['Студентов', 'Иванов', 'Петров', 'Сидоров', 'Смирнов'];
    const studentFirstNames = ['Владимир', 'Александр', 'Дмитрий', 'Максим', 'Иван'];
    const studentMiddleNames = ['Владимирович', 'Александрович', 'Дмитриевич', 'Максимович', 'Иванович'];

    for (let i = 0; i < 5; i++) {
      users.push({
        id_role: 3, // Роль студента
        gender: 'male',
        email: `student${i+1}@example.com`,
        login: `student${i+1}`,
        password: i === 0 ? studentPassword : await bcrypt.hash(`student${i+1}`, 10),
        last_name: studentLastNames[i],
        first_name: studentFirstNames[i],
        middle_name: studentMiddleNames[i],
        photo: null,
      });
    }

    // 10 родителей
    const parentLastNames = ['Родительнов', 'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Соколов', 'Михайлов'];
    const parentFirstNames = ['Елизавета', 'Сергей', 'Ольга', 'Андрей', 'Татьяна', 'Алексей', 'Наталья', 'Владимир', 'Ирина', 'Дмитрий'];
    const parentMiddleNames = ['Рудольфовна', 'Иванович', 'Петровна', 'Сергеевич', 'Александровна', 'Владимирович', 'Михайловна', 'Алексеевич', 'Дмитриевна', 'Андреевич'];
    const parentGenders = ['female', 'male', 'female', 'male', 'female', 'male', 'female', 'male', 'female', 'male'];

    for (let i = 0; i < 10; i++) {
      users.push({
        id_role: 4, // Роль родителя
        gender: parentGenders[i],
        email: i === 0 ? 'parent@example.com' : `parent${i+1}@example.com`,
        login: i === 0 ? 'parent' : `parent${i+1}`,
        password: i === 0 ? parentPassword : await bcrypt.hash(`parent${i+1}`, 10),
        last_name: parentLastNames[i] + (parentGenders[i] === 'female' ? 'а' : ''),
        first_name: parentFirstNames[i],
        middle_name: parentMiddleNames[i],
        photo: null,
      });
    }

    await queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
