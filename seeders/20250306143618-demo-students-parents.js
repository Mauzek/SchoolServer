'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const studentParents = [];
    
    // Создаем связи между студентами и родителями
    // У каждого студента может быть 1-3 родителя
    // У каждого родителя может быть 1-2 ребенка
    
    // Студент 1 (id=1) связан с родителем 1 (id=1)
    studentParents.push({
      id_parent: 1,
      id_student: 1,
    });
    
    // Студент 2 (id=2) связан с родителями 2 и 3 (id=2,3)
    studentParents.push({
      id_parent: 2,
      id_student: 2,
    });
    studentParents.push({
      id_parent: 3,
      id_student: 2,
    });
    
    // Студент 3 (id=3) связан с родителями 4 и 5 (id=4,5)
    studentParents.push({
      id_parent: 4,
      id_student: 3,
    });
    studentParents.push({
      id_parent: 5,
      id_student: 3,
    });
    
    // Студент 4 (id=4) связан с родителями 6, 7 и 8 (id=6,7,8)
    studentParents.push({
      id_parent: 6,
      id_student: 4,
    });
    studentParents.push({
      id_parent: 7,
      id_student: 4,
    });
    studentParents.push({
      id_parent: 8,
      id_student: 4,
    });
    
    // Студент 5 (id=5) связан с родителями 9 и 10 (id=9,10)
    studentParents.push({
      id_parent: 9,
      id_student: 5,
    });
    studentParents.push({
      id_parent: 10,
      id_student: 5,
    });
    
    await queryInterface.bulkInsert('student_parents', studentParents);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('student_parents', null, {});
  },
};
