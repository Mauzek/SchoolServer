const { Grade, Student, Class, User, Subject } = require("../models");

const getGradesByClass = async (req, res) => {
  const { idClass } = req.params;

  try {
    const students = await Student.findAll({
      where: { id_class: idClass },
      include: {
        model: User,
        attributes: ["first_name", "last_name", "middle_name"],
      },
    });

    const grades = await Promise.all(students.map(async (student) => {
      const studentGrades = await Grade.findAll({
        where: { id_student: student.id_student },
      });

      return {
        student: {
          id_student: student.id_student,
          firstName: student.User.first_name,
          lastName: student.User.last_name,
          middleName: student.User.middle_name,
        },
        grades: studentGrades,
      };
    }));

    res.json(grades);
  } catch (error) {
    console.error("Error fetching grades by class:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

const getGradesByClassAndSubject = async (req, res) => {
  const { idClass, idSubject } = req.params;

  try {
    const students = await Student.findAll({
      where: { id_class: idClass },
      include: {
        model: User,
        attributes: ["first_name", "last_name", "middle_name"],
      },
    });

    const grades = await Promise.all(students.map(async (student) => {
      const studentGrades = await Grade.findAll({
        where: {
          id_student: student.id_student,
          id_subject: idSubject,
        },
        include: {
          model: Subject,
          attributes: ["name"],
        },
      });

      return {
        student: {
          idStudent: student.id_student,
          firstName: student.User.first_name,
          lastName: student.User.last_name,
          middleName: student.User.middle_name,
        },
        grades: studentGrades.map(grade => ({
          idGrade: grade.id_grade,
          idStudent: grade.id_student,
          grade: grade.grade_value,
          gradeDate: grade.grade_date,
          gradeType: grade.grade_type,
          description: grade.description,
          subject: grade.Subject ? { idSubject: grade.id_subject, name: grade.Subject.name } : null,
        })),
      };
    }));

    res.json(grades);
  } catch (error) {
    console.error("Error fetching grades by class and subject:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

const getGradesByStudent = async (req, res) => {
  const { idStudent } = req.params;

  try {
    const student = await Student.findOne({
      where: { id_student: idStudent },
      include: {
        model: User,
        attributes: ["first_name", "last_name", "middle_name"],
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Студент не найден" });
    }

    const studentGrades = await Grade.findAll({
      where: { id_student: idStudent },
      include: {
        model: Subject,
        attributes: ["name"],
      },
    });

    const grades = {
      student: {
        idStudent: student.id_student,
        firstName: student.User.first_name,
        lastName: student.User.last_name,
        middleName: student.User.middle_name,
      },
      grades: studentGrades.map(grade => ({
        idGrade: grade.id_grade,
        idStudent: grade.id_student,      
        grade: grade.grade_value,
        gradeDate: grade.grade_date,
        gradeType: grade.grade_type,
        description: grade.description,
        subject: grade.Subject ? { idSubject: grade.id_subject, name: grade.Subject.name } : null,
      })),
    };

    res.json(grades);
  } catch (error) {
    console.error("Error fetching grades by student:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

const createGrade = async (req, res) => {
  const { idStudent, idSubject, gradeValue, gradeDate, gradeType, description } = req.body;

  try {
    const grade = await Grade.create({
      id_student: idStudent,
      id_subject: idSubject,
      grade_value: gradeValue,
      grade_date: gradeDate,
      grade_type: gradeType,
      description,
    });

    res.status(201).json(grade);
  } catch (error) {
    console.error("Error creating grade:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

const updateGrade = async (req, res) => {
  const { idGrade } = req.params;
  const { gradeValue, gradeDate, gradeType, description } = req.body;

  try {
    const grade = await Grade.findByPk(idGrade);

    if (!grade) {
      return res.status(404).json({ message: "Оценка не найдена" });
    }

    grade.grade_value = gradeValue;
    grade.grade_date = gradeDate;
    grade.grade_type = gradeType;
    grade.description = description;

    await grade.save();

    res.json(grade);
  } catch (error) {
    console.error("Error updating grade:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

const deleteGrade = async (req, res) => {
  const { idGrade } = req.params;

  try {
    const grade = await Grade.findByPk(idGrade);

    if (!grade) {
      return res.status(404).json({ message: "Оценка не найдена" });
    }

    await grade.destroy();

    res.json({ message: "Оценка удалена" });
  } catch (error) {
    console.error("Error deleting grade:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

module.exports = {
  getGradesByClass,
  getGradesByClassAndSubject,
  getGradesByStudent,
  createGrade,
  updateGrade,
  deleteGrade,
};