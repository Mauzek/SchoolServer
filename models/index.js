const { sequelize } = require('../database/db');
const User = require('./User');
const Role = require('./Role');
const Parent = require('./Parent');
const Student = require('./Student');
const StudentParent = require('./StudentParent');
const Employee = require('./Employee');
const Position = require('./Position');
const EmployeeEducation = require('./EmployeeEducation');
const EducationLevel = require('./EducationLevel');
const EducationalInstitution = require('./EducationalInstitution');
const Specialty = require('./Specialty');
const Class = require('./Class');
const Schedule = require('./Schedule');
const Subject = require('./Subject');
const SubjectTextbook = require('./SubjectTextbook');
const Grade = require('./Grade');
const Assignment = require('./Assignment');
const AssignmentAnswer = require('./AssignmentAnswer');
const Testing = require('./Testing');
const TestingAnswer = require('./TestingAnswer');

// Ассоциации для User
User.belongsTo(Role, { foreignKey: 'id_role' });
Role.hasMany(User, { foreignKey: 'id_role' });

User.hasOne(Parent, { foreignKey: 'id_user' });
Parent.belongsTo(User, { foreignKey: 'id_user' });

User.hasOne(Student, { foreignKey: 'id_user' });
Student.belongsTo(User, { foreignKey: 'id_user' });

User.hasOne(Employee, { foreignKey: 'id_user' });
Employee.belongsTo(User, { foreignKey: 'id_user' });

// Ассоциации для Parent
Parent.belongsToMany(Student, { through: StudentParent, foreignKey: 'id_parent' });
Student.belongsToMany(Parent, { through: StudentParent, foreignKey: 'id_student' });

// Ассоциации для Student
Student.belongsTo(Class, { foreignKey: 'id_class' });
Class.hasMany(Student, { foreignKey: 'id_class' });

Student.hasMany(Grade, { foreignKey: 'id_student' });
Grade.belongsTo(Student, { foreignKey: 'id_student' });

Student.hasMany(AssignmentAnswer, { foreignKey: 'id_student' });
AssignmentAnswer.belongsTo(Student, { foreignKey: 'id_student' });

Student.hasMany(TestingAnswer, { foreignKey: 'id_student' });
TestingAnswer.belongsTo(Student, { foreignKey: 'id_student' });

// Ассоциации для Employee
Employee.belongsTo(Position, { foreignKey: 'id_position' });
Position.hasMany(Employee, { foreignKey: 'id_position' });

Employee.hasMany(EmployeeEducation, { foreignKey: 'id_employee' });
EmployeeEducation.belongsTo(Employee, { foreignKey: 'id_employee' });

Employee.hasMany(Schedule, { foreignKey: 'id_employee' });
Schedule.belongsTo(Employee, { foreignKey: 'id_employee' });

Employee.hasMany(Assignment, { foreignKey: 'id_employee' });
Assignment.belongsTo(Employee, { foreignKey: 'id_employee' });

// Ассоциации для EmployeeEducation
EmployeeEducation.belongsTo(EducationLevel, { foreignKey: 'id_education_level' });
EducationLevel.hasMany(EmployeeEducation, { foreignKey: 'id_education_level' });

EmployeeEducation.belongsTo(EducationalInstitution, { foreignKey: 'id_educational_institution' });
EducationalInstitution.hasMany(EmployeeEducation, { foreignKey: 'id_educational_institution' });

EmployeeEducation.belongsTo(Specialty, { foreignKey: 'id_specialty' });
Specialty.hasMany(EmployeeEducation, { foreignKey: 'id_specialty' });

// Ассоциации для Class
Class.hasMany(Schedule, { foreignKey: 'id_class' });
Schedule.belongsTo(Class, { foreignKey: 'id_class' });
// Связь "один-ко-многим": один сотрудник может быть классным руководителем нескольких классов
Employee.hasMany(Class, { foreignKey: 'id_employee', as: 'Classes'});
// Связь "многие-к-одному": один класс имеет одного классного руководителя
Class.belongsTo(Employee, { foreignKey: 'id_employee', as: 'ClassTeacher' });

Class.hasMany(Assignment, { foreignKey: 'id_class' });
Assignment.belongsTo(Class, { foreignKey: 'id_class' });

// Ассоциации для Subject
Subject.hasMany(SubjectTextbook, { foreignKey: 'id_subject' });
SubjectTextbook.belongsTo(Subject, { foreignKey: 'id_subject' });

Subject.hasMany(Grade, { foreignKey: 'id_subject' });
Grade.belongsTo(Subject, { foreignKey: 'id_subject' });

Subject.hasMany(Schedule, { foreignKey: 'id_subject' });
Schedule.belongsTo(Subject, { foreignKey: 'id_subject' });

Subject.hasMany(Assignment, { foreignKey: 'id_subject' });
Assignment.belongsTo(Subject, { foreignKey: 'id_subject' });

// Ассоциации для Assignment
Assignment.hasMany(AssignmentAnswer, { foreignKey: 'id_assignment' });
AssignmentAnswer.belongsTo(Assignment, { foreignKey: 'id_assignment' });

Assignment.hasOne(Testing, { foreignKey: 'id_assignment' });
Testing.belongsTo(Assignment, { foreignKey: 'id_assignment' });

// Ассоциации для Testing
// Связь "один-ко-многим": один тест может иметь много ответов
Testing.hasMany(TestingAnswer, { foreignKey: 'id_testing', as: 'Answers' });
// Связь "многие-к-одному": один ответ принадлежит одному тесту
TestingAnswer.belongsTo(Testing, { foreignKey: 'id_testing', as: 'Testing'});

// Экспортируем все модели
module.exports = {
  sequelize,
  User,
  Role,
  Parent,
  Student,
  StudentParent,
  Employee,
  Position,
  EmployeeEducation,
  EducationLevel,
  EducationalInstitution,
  Specialty,
  Class,
  Schedule,
  Subject,
  SubjectTextbook,
  Grade,
  Assignment,
  AssignmentAnswer,
  Testing,
  TestingAnswer,
};