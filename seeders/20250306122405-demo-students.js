'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const students = [];
    
    // Классы для распределения студентов
    const classes = [1, 2, 3]; // Предполагаем, что у вас есть 3 класса с ID 1-3
    
    // Группы крови
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+'];
    
    // Создаем 5 студентов
    for (let i = 0; i < 5; i++) {
      // ID пользователя начинается с 3 (после admin, teacher)
      const userId = i + 3;
      
      // Генерируем случайную дату рождения (2005-2009)
      const year = 2005 + Math.floor(Math.random() * 5);
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      
      // Генерируем случайный номер телефона
      const phone = i === 0 ? '+1234567890' : `+7${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
      
      // Генерируем случайный номер документа
      const docNumber = i === 0 ? 'AB1234567' : `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
      
      // Выбираем случайный класс и группу крови
      const classId = i === 0 ? 1 : classes[Math.floor(Math.random() * classes.length)];
      const bloodGroup = i === 0 ? 'A+' : bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
      
      students.push({
        id_user: userId,
        id_class: classId,
        phone: phone,
        birth_date: i === 0 ? new Date('2005-05-15') : new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`),
        document_number: docNumber,
        blood_group: bloodGroup,
      });
    }
    
    await queryInterface.bulkInsert('students', students);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('students', null, {});
  },
};
