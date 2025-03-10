const {login, refreshAccessToken, register} = require("./authController");
const { getGradesByClass, getGradesByClassAndSubject, getGradesByStudent, createGrade, updateGrade, deleteGrade } = require("./gradeController");
const { getStudents, getStudentsByClass } = require("./studentController");

module.exports = {
  register,
  login,
  refreshAccessToken,
  getStudents,
  getStudentsByClass,
  getGradesByClass,
  getGradesByClassAndSubject,
  getGradesByStudent,
  createGrade,
  updateGrade,
  deleteGrade,
};