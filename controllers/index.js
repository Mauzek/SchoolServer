const {
  createAssignmentAnswer,
  createTestingAnswer,
  updateAssignmentAnswer,
  getAssignmentAnswers,
  getTestingAnswers,
  getTestingAnswerById,
  getAssignmentAnswerById,
  updateTestingAnswerGrade,
  getStudentAssignmentAnswer,
  getStudentTestingAnswer,
} = require("./answerContorller");
const {
  createAssignment,
  updateAssignmentById,
  deleteAssignmentById,
  getAssignmentById,
  getAssignmentsByClassId,
  getAssignmentsBySubjectId,
  getAssignmentsBySubjectAndClassId,
} = require("./assignmentController");
const { login, refreshAccessToken, register, loginWithJWT, updateUserAvatar } = require("./authController");
const {
  getClassById,
  getClassByNumberAndLetter,
  getClassesByEmployeeId,
  getAllClasses,
  createClass,
  updateClassById,
  deleteClassById,
} = require("./classController");
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
const {
  createPosition,
  deletePositionById,
  updatePositionById,
  getAllPositions,
} = require("./positionController");
const {
  getAllRoles,
  getRoleById,
  deleteRole,
  updateRole,
  createRole,
} = require("./roleController");
const {
  createSchedule,
  deleteScheduleById,
  updateScheduleById,
  getScheduleByClass,
  getScheduleByEmployee,
  getClassScheduleByWeekInterval,
  getEmployeeScheduleByWeekInterval,
} = require("./scheduleController");
const { getAverageGradesByClass, getAverageGradesByStudent, getAverageGradesBySubject, getGradeDistributionByClass, getGradeDistributionByStudent, getGradeDistributionBySubject, getTopStudentsByAverageGrade } = require("./statisticsContorller");
const {
  getAllStudents,
  getStudentsByClass,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStydentsByParentId,
} = require("./studentController");
const {
  getAllSubjects,
  updateSubjectById,
  deleteSubjectById,
  createSubject,
  getSubjectById,
} = require("./subjectController");
const {
  getTextbooksBySubject,
  getTextbooksByName,
  getAllTextbooks,
  updateTextbookById,
  deleteTextbookById,
  createTextbook,
  getTextbookById,
  getTextbooksByISBN,
} = require("./subjectTextbookController");

module.exports = {
  // Auth
  register,
  login,
  refreshAccessToken,
  loginWithJWT,
  updateUserAvatar,

  // Students
  getAllStudents,
  getStudentById,
  getStudentsByClass,
  getStydentsByParentId,
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
  getSubjectById,

  //SubjectTextbooks
  createTextbook,
  updateTextbookById,
  deleteTextbookById,
  getTextbooksBySubject,
  getTextbooksByName,
  getTextbookById,
  getAllTextbooks,
  getTextbooksByISBN,

  //Class
  createClass,
  updateClassById,
  deleteClassById,
  getClassById,
  getClassByNumberAndLetter,
  getClassesByEmployeeId,
  getAllClasses,

  //Schedule
  createSchedule,
  deleteScheduleById,
  updateScheduleById,
  getScheduleByClass,
  getScheduleByEmployee,
  getClassScheduleByWeekInterval,
  getEmployeeScheduleByWeekInterval,

  //Assignments
  createAssignment,
  updateAssignmentById,
  deleteAssignmentById,
  getAssignmentById,
  getAssignmentsByClassId,
  getAssignmentsBySubjectId,
  getAssignmentsBySubjectAndClassId,

  // Answers
  createAssignmentAnswer,
  createTestingAnswer,
  updateAssignmentAnswer,
  updateTestingAnswerGrade,
  getAssignmentAnswers,
  getTestingAnswers,
  getTestingAnswerById,
  getAssignmentAnswerById,
  getStudentAssignmentAnswer,
  getStudentTestingAnswer,

  // Statistics
  getAverageGradesByClass,
  getAverageGradesByStudent,
  getAverageGradesBySubject,
  getGradeDistributionByClass,
  getGradeDistributionByStudent,
  getGradeDistributionBySubject,
  getTopStudentsByAverageGrade,
};
