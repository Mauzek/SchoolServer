'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const parents = [];
    
    // Типы родителей
    const parentTypes = ['Mother', 'Father', 'Guardian'];
    
    // Места работы
    const workplaces = ['Tech Company', 'School', 'Hospital', 'Bank', 'Government', 'University', 'Retail Store', 'Restaurant', 'Construction Company', 'Self-employed'];
    
    // Должности
    const positions = ['Engineer', 'Teacher', 'Doctor', 'Manager', 'Clerk', 'Professor', 'Sales Associate', 'Chef', 'Contractor', 'Business Owner'];
    
    // Создаем 10 родителей
    for (let i = 0; i < 10; i++) {
      // ID пользователя начинается с 8 (после admin, teacher, 5 студентов)
      const userId = i + 8;
      
      // Генерируем случайный номер телефона
      const phone = i === 0 ? '+1122334455' : `+7${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
      
      // Генерируем случайный рабочий номер телефона (может быть null)
      const workPhone = Math.random() > 0.3 ? `+7${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}` : null;
      
      // Генерируем случайные данные паспорта
      const passportSeries = i === 0 ? 'CD5678' : `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const passportNumber = i === 0 ? '123456' : Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      
      // Выбираем случайный тип родителя, место работы и должность
      const parentType = i === 0 ? 'Father' : parentTypes[Math.floor(Math.random() * parentTypes.length)];
      const workplace = i === 0 ? 'Tech Company' : workplaces[Math.floor(Math.random() * workplaces.length)];
      const position = i === 0 ? 'Engineer' : positions[Math.floor(Math.random() * positions.length)];
      
      // Генерируем случайное количество детей (1-3)
      const childrenCount = i === 0 ? 1 : Math.floor(Math.random() * 3) + 1;
      
      // Генерируем случайный адрес регистрации
      const registrationAddress = i === 0 ? '456 Family Ave., City, Country' : `${Math.floor(Math.random() * 1000)} ${['Main', 'Park', 'Oak', 'Maple', 'Pine'][Math.floor(Math.random() * 5)]} ${['St.', 'Ave.', 'Blvd.', 'Rd.', 'Ln.'][Math.floor(Math.random() * 5)]}, City, Country`;
      
      parents.push({
        id_user: userId,
        parent_type: parentType,
        phone: phone,
        work_phone: workPhone,
        workplace: workplace,
        position: position,
        children_count: childrenCount,
        passport_series: passportSeries,
        passport_number: passportNumber,
        registration_address: registrationAddress,
      });
    }
    
    await queryInterface.bulkInsert('parents', parents);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('parents', null, {});
  },
};
