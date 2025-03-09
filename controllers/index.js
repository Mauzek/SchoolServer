const {login, refreshAccessToken, register} = require("./authController");
const { getStudents, getStudentsByClass } = require("./studentController");

module.exports = {
  register,
  login,
  refreshAccessToken,
  getStudents,
  getStudentsByClass,
};