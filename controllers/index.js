const { create } = require("../models/User");
const { login, refreshAccessToken, register } = require("./authController");
const {
  createEducationalInstitution,
  deleteEducationalInstitutionById,
  updateEducationalInstitutionById,
  getAllEducationalInstitutions,
} = require("./educationalInstitution");
const {
  updateEducationLevelById,
  createEducationLevel,
  deleteEducationLevelById,
  getAllEducationLevels,
} = require("./educationLevel");
const {
  createSpecialty,
  updateSpecialtyById,
  deleteSpecialtyById,
  getAllSpecialties,
} = require("./educationSpecialty");
const {
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  getAllEmployees,
} = require("./employeeController");
const {
  createEmployeeEducation,
  getEmployeeEducationsByEmployeeId,
  deleteEmployeeEducationById,
  updateEmployeeEducationById,
  getAllEducationSettings,
} = require("./employeeEducationController");
const {
  getGradesByClass,
  getGradesByClassAndSubject,
  getGradesByStudent,
  createGrade,
  updateGrade,
  deleteGrade,
} = require("./gradeController");
const {
  getAllParents,
  getParentById,
  deleteParent,
  updateParent,
} = require("./parentController");
const { createPosition, deletePositionById, updatePositionById, getAllPositions } = require("./positionController");
const {
  getAllRoles,
  getRoleById,
  deleteRole,
  updateRole,
  createRole,
} = require("./roleController");
const {
  getAllStudents,
  getStudentsByClass,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("./studentController");
const { getAllSubjects, updateSubjectById, deleteSubjectById, createSubject } = require("./subjectController");

module.exports = {
  // Auth
  register,
  login,
  refreshAccessToken,

  // Students
  getAllStudents,
  getStudentById,
  getStudentsByClass,
  updateStudent,
  deleteStudent,

  // Grades
  getGradesByClass,
  getGradesByClassAndSubject,
  getGradesByStudent,
  createGrade,
  updateGrade,
  deleteGrade,

  // Employees
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  getAllEmployees,

  // Parents
  getAllParents,
  getParentById,
  deleteParent,
  updateParent,

  /// Roles
  getAllRoles,
  getRoleById,
  deleteRole,
  updateRole,
  createRole,

  //EmployeeEducation
  createEmployeeEducation,
  updateEmployeeEducationById,
  deleteEmployeeEducationById,
  getEmployeeEducationsByEmployeeId,
  getAllEducationSettings,

  //EducationSpecialty
  createSpecialty,
  updateSpecialtyById,
  deleteSpecialtyById,
  getAllSpecialties,

  //EducationalInstitution
  createEducationalInstitution,
  updateEducationalInstitutionById,
  deleteEducationalInstitutionById,
  getAllEducationalInstitutions,

  //EducationLevel
  createEducationLevel,
  updateEducationLevelById,
  deleteEducationLevelById,
  getAllEducationLevels,

  //Position
  createPosition,
  updatePositionById,
  deletePositionById,
  getAllPositions,

  //Subjects
  createSubject,
  updateSubjectById,
  deleteSubjectById,
  getAllSubjects,
};
