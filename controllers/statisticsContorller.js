const { Grade, Student, User, Class, Subject, Employee } = require("../models");

// Get average grades for each subject
const getAverageGradesBySubject = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [
        {
          model: Grade,
          attributes: ["grade_value"],
        },
      ],
    });

    const averageGrades = subjects.map((subject) => {
      const grades = subject.Grades.map((grade) => grade.grade_value);
      const averageGrade =
        grades.reduce((sum, grade) => sum + grade, 0) / grades.length || 0;

      return {
        idSubject: subject.id_subject,
        subjectName: subject.name,
        averageGrade,
      };
    });

    res
      .status(200)
      .json({
        message: "Average grades by subject fetched successfully",
        data: averageGrades,
      });
  } catch (error) {
    console.error("Error fetching average grades by subject:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get average grades for each class
const getAverageGradesByClass = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Student,
          include: [
            {
              model: Grade,
              attributes: ["grade_value"],
            },
            {
              model: User,
              attributes: ["first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Employee,
          as: "ClassTeacher",
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["first_name", "last_name", "middle_name"],
            },
          ],
        },
      ],
    });

    const averageGrades = classes.map((cls) => {
      const grades = cls.Students.flatMap((student) =>
        student.Grades.map((grade) => grade.grade_value)
      );
      const averageGrade =
        grades.reduce((sum, grade) => sum + grade, 0) / grades.length || 0;

      return {
        idClass: cls.id_class,
        classNumber: cls.class_number,
        classLetter: cls.class_letter,
        averageGrade,
        studentCount: cls.Students.length,
        classTeacher: cls.ClassTeacher
          ? {
              idEmployee: cls.ClassTeacher.id_employee,
              firstName: cls.ClassTeacher.User.first_name,
              lastName: cls.ClassTeacher.User.last_name,
              middleName: cls.ClassTeacher.User.middle_name,
            }
          : null,
      };
    });

    res
      .status(200)
      .json({
        message: "Average grades by class fetched successfully",
        data: averageGrades,
      });
  } catch (error) {
    console.error("Error fetching average grades by class:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get average grades for each student
const getAverageGradesByStudent = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: Grade,
          attributes: ["grade_value"],
        },
        {
          model: User,
          attributes: ["first_name", "last_name", "middle_name"],
        },
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
          include: [
            {
              model: Employee,
              as: "ClassTeacher",
              attributes: ["id_employee"],
              include: [
                {
                  model: User,
                  attributes: ["first_name", "last_name", "middle_name"],
                },
              ],
            },
          ]
        },
      ],
    });

    const averageGrades = students.map((student) => {
      const grades = student.Grades.map((grade) => grade.grade_value);
      const averageGrade =
        grades.reduce((sum, grade) => sum + grade, 0) / grades.length || 0;

      return {
        idStudent: student.id_student,
        firstName: student.User.first_name,
        lastName: student.User.last_name,
        middleName: student.User.middle_name,
        class: {
          idClass: student.Class.id_class,
          classNumber: student.Class.class_number,
          classLetter: student.Class.class_letter,
        },
        classTeacher: {
          idEmployee: student.Class.ClassTeacher.id_employee,
          firstName: student.Class.ClassTeacher.User.first_name,
          lastName: student.Class.ClassTeacher.User.last_name,
          middleName: student.Class.ClassTeacher.User.middle_name,
        },
        averageGrade,
      };
    });

    res
      .status(200)
      .json({
        message: "Average grades by student fetched successfully",
        data: averageGrades,
      });
  } catch (error) {
    console.error("Error fetching average grades by student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get grade distribution for each subject
const getGradeDistributionBySubject = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [
        {
          model: Grade,
          attributes: ["grade_value"],
        },
      ],
    });

    const gradeDistribution = subjects.map((subject) => {
      const grades = subject.Grades.map((grade) => grade.grade_value);

      const distribution = grades.reduce((acc, grade) => {
        if (grade >= 2 && grade <= 5) {
          acc[grade] = (acc[grade] || 0) + 1;
        }
        return acc;
      }, { 2: 0, 3: 0, 4: 0, 5: 0 });

      return {
        idSubject: subject.id_subject,  
        subjectName: subject.name,
        distribution,
      };
    });

    res
      .status(200)
      .json({
        message: "Grade distribution by subject fetched successfully",
        data: gradeDistribution,
      });
  } catch (error) {
    console.error("Error fetching grade distribution by subject:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get grade distribution for each class
const getGradeDistributionByClass = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Student,
          include: [
            {
              model: Grade,
              attributes: ["grade_value"],
            },
            {
              model: User,
              attributes: ["first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Employee,
          as: "ClassTeacher",
          include: [
            {
              model: User,
              attributes: ["first_name", "last_name", "middle_name"],
            },
          ],
        },
      ],
    });

    const gradeDistribution = classes.map((cls) => {
      const grades = cls.Students.flatMap((student) =>
        student.Grades.map((grade) => grade.grade_value)
      );

      const distribution = grades.reduce((acc, grade) => {
        if (grade >= 2 && grade <= 5) {
          acc[grade] = (acc[grade] || 0) + 1;
        }
        return acc;
      }, { 2: 0, 3: 0, 4: 0, 5: 0 });

      return {
        idClass: cls.id_class,
        classNumber: cls.class_number,
        classLetter: cls.class_letter,
        distribution,
        numberOfStudents: cls.Students.length,
        classTeacher: cls.ClassTeacher
          ? {
              idEmployee: cls.ClassTeacher.id_employee,
              firstName: cls.ClassTeacher.User.first_name,
              lastName: cls.ClassTeacher.User.last_name,
              middleName: cls.ClassTeacher.User.middle_name,
            }
          : null,
      };
    });

    res
      .status(200)
      .json({
        message: "Grade distribution by class fetched successfully",
        data: gradeDistribution,
      });
  } catch (error) {
    console.error("Error fetching grade distribution by class:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get grade distribution for each student
const getGradeDistributionByStudent = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: Grade,
          attributes: ["grade_value"],
        },
        {
          model: User,
          attributes: ["first_name", "last_name", "middle_name"],
        },
        {
          model: Class,
          attributes: ["id_class","class_number", "class_letter"],
        },
      ],
    });

    const gradeDistribution = students.map((student) => {
      const grades = student.Grades.map((grade) => grade.grade_value);

      const distribution = grades.reduce((acc, grade) => {
        if (grade >= 2 && grade <= 5) {
          acc[grade] = (acc[grade] || 0) + 1;
        }
        return acc;
      }, { 2: 0, 3: 0, 4: 0, 5: 0 });

      return {
        studentId: student.id_student,
        firstName: student.User.first_name,
        lastName: student.User.last_name,
        middleName: student.User.middle_name,
        class: {
          idClass: student.Class.id_class, 
          classNumber: student.Class.class_number,
          classLetter: student.Class.class_letter,
        },
        distribution,
      };
    });

    res
      .status(200)
      .json({
        message: "Grade distribution by student fetched successfully",
        data: gradeDistribution,
      });
  } catch (error) {
    console.error("Error fetching grade distribution by student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAverageGradesBySubject,
  getAverageGradesByClass,
  getAverageGradesByStudent,
  getGradeDistributionBySubject,
  getGradeDistributionByClass,
  getGradeDistributionByStudent,
};