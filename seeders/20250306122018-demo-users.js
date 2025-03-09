'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const adminPassword = await bcrypt.hash('password123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const parentPassword = await bcrypt.hash('parent123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id_role: 1,
        gender: 'male',
        email: 'admin@example.com',
        login: 'admin',
        password: adminPassword,
        last_name: 'Adminov',
        first_name: 'Admin',
        middle_name: 'Adminovich',
        photo: null,
      },
      {
        id_role: 2,
        gender: 'female',
        email: 'teacher@example.com',
        login: 'teacher',
        password: teacherPassword,
        last_name: 'Teacherova',
        first_name: 'Teacher',
        middle_name: 'Teacherovna',
        photo: null,
      },
      {
        id_role: 3,
        gender: 'male',
        email: 'student@example.com',
        login: 'student',
        password: studentPassword,
        last_name: 'Studentov',
        first_name: 'Student',
        middle_name: 'Studentovich',
        photo: null,
      },
      {
        id_role: 4,
        gender: 'female',
        email: 'parent@example.com',
        login: 'parent',
        password: parentPassword,
        last_name: 'Parentova',
        first_name: 'Parent',
        middle_name: 'Parentovna',
        photo: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};