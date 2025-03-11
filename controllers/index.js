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
const { getStudents, getStudentsByClass, getStudentById } = require("./studentController");

module.exports = {
  register,
  login,
  refreshAccessToken,
  getStudents,
  getStudentsByClass,
  getGradesByClass,
  getGradesByClassAndSubject,
  getGradesByStudent,
  getStudentById,
  createGrade,
  updateGrade,
  deleteGrade,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  getAllEmployees,
};
