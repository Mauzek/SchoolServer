const { login, refreshAccessToken, register } = require("./authController");
const { updateEmployee, deleteEmployee, getEmployeeById, getAllEmployees } = require("./employeeController");
const {
  getGradesByClass,
  getGradesByClassAndSubject,
  getGradesByStudent,
  createGrade,
  updateGrade,
  deleteGrade,
} = require("./gradeController");
const { getAllParents, getParentById, deleteParent, updateParent } = require("./parentController");
const { getAllStudents, getStudentsByClass, getStudentById } = require("./studentController");

module.exports = {
  // Auth
  register,
  login,
  refreshAccessToken,

  // Students
  getAllStudents,
  getStudentById,
  getStudentsByClass,

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
  updateParent
};
