const { AssignmentAnswer, TestingAnswer, Assignment, Testing, Student, User, Class, Subject } = require("../models");

const createAssignmentAnswer = async (req, res) => {
  const { idAssignment, idStudent, grade, submissionDate, textAnswer } = req.body;

  try {
    // Сохраняем относительный путь в базе данных
    const filePath = req.file ? `/uploads/answers/${req.file.filename}` : null;

    const answer = await AssignmentAnswer.create({
      id_assignment: idAssignment,
      id_student: idStudent,
      grade,
      submission_date: submissionDate,
      text_answer: textAnswer,
      file_link: filePath, // Сохраняем путь
    });

    const createdAnswer = await AssignmentAnswer.findByPk(answer.id_answer, {
      include: [
        {
          model: Assignment,
          attributes: ["id_assignment", "title", "description"],
          include: {
            model: Subject,
            attributes: ["id_subject", "name"],
          },
        },
        {
          model: Student,
          attributes: ["id_student"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
            {
              model: Class,
              attributes: ["id_class", "class_number", "class_letter"],
            },
          ],
        },
      ],
    });

    // Формируем полный URL для ответа
    const formattedAnswer = {
      idAnswer: createdAnswer.id_answer,
      assignment: {
        idAssignment: createdAnswer.Assignment.id_assignment,
        title: createdAnswer.Assignment.title,
        description: createdAnswer.Assignment.description,
        subject: {
          idSubject: createdAnswer.Assignment.Subject.id_subject,
          name: createdAnswer.Assignment.Subject.name,
        },
      },
      student: createdAnswer.Student
        ? {
            idStudent: createdAnswer.Student.id_student,
            class: createdAnswer.Student.Class
              ? {
                  idClass: createdAnswer.Student.Class.id_class,
                  classNumber: createdAnswer.Student.Class.class_number,
                  classLetter: createdAnswer.Student.Class.class_letter,
                }
              : null,
            idUser: createdAnswer.Student.User.id_user,
            firstName: createdAnswer.Student.User.first_name,
            lastName: createdAnswer.Student.User.last_name,
            middleName: createdAnswer.Student.User.middle_name,
          }
        : null,
      grade: createdAnswer.grade,
      submissionDate: createdAnswer.submission_date,
      textAnswer: createdAnswer.text_answer,
      fileLink: createdAnswer.file_link
        ? `${req.protocol}://${req.get("host")}${createdAnswer.file_link}` // Формируем ссылку
        : null,
    };

    res.status(201).json({
      message: "Assignment answer created successfully",
      data: formattedAnswer,
    });
  } catch (error) {
    console.error("Error creating assignment answer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createTestingAnswer = async (req, res) => {
  const { idTesting, idStudent, grade, submissionDate } = req.body;

  try {
    // Сохраняем относительный путь в базе данных
    const filePath = req.file ? `/uploads/answers/${req.file.filename}` : null;

    const answer = await TestingAnswer.create({
      id_testing: idTesting,
      id_student: idStudent,
      grade,
      submission_date: submissionDate,
      file_link: filePath, // Сохраняем путь
    });

    const createdAnswer = await TestingAnswer.findByPk(answer.id_testing_answer, {
      include: [
        {
          model: Testing,
          as: "Testing",
          attributes: ["id_testing"],
          include: {
            model: Assignment,
            attributes: ["id_assignment", "title", "description"],
            include: {
              model: Subject,
              attributes: ["id_subject", "name"],
            },
          },
        },
        {
          model: Student,
          attributes: ["id_student"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
            {
              model: Class,
              attributes: ["id_class", "class_number", "class_letter"],
            },
          ],
        },
      ],
    });

    // Формируем полный URL для ответа
    const formattedAnswer = {
      idTestingAnswer: createdAnswer.id_testing_answer,
      testing: {
        idTesting: createdAnswer.Testing.id_testing,
        title: createdAnswer.Testing.Assignment.title,
        description: createdAnswer.Testing.Assignment.description,
        subject: {
          idSubject: createdAnswer.Testing.Assignment.Subject.id_subject,
          name: createdAnswer.Testing.Assignment.Subject.name,
        },
      },
      student: createdAnswer.Student
        ? {
            idStudent: createdAnswer.Student.id_student,
            class: createdAnswer.Student.Class
              ? {
                  idClass: createdAnswer.Student.Class.id_class,
                  classNumber: createdAnswer.Student.Class.class_number,
                  classLetter: createdAnswer.Student.Class.class_letter,
                }
              : null,
            idUser: createdAnswer.Student.User.id_user,
            firstName: createdAnswer.Student.User.first_name,
            lastName: createdAnswer.Student.User.last_name,
            middleName: createdAnswer.Student.User.middle_name,
          }
        : null,
      grade: createdAnswer.grade,
      submissionDate: createdAnswer.submission_date,
      fileLink: createdAnswer.file_link
        ? `${req.protocol}://${req.get("host")}${createdAnswer.file_link}` // Формируем ссылку
        : null,
    };

    res.status(201).json({
      message: "Testing answer created successfully",
      data: formattedAnswer,
    });
  } catch (error) {
    console.error("Error creating testing answer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateAssignmentAnswer = async (req, res) => {
  const { idAnswer } = req.params;
  const { grade } = req.body;
  try {
    const answer = await AssignmentAnswer.findByPk(idAnswer);
    if (!answer) {
      return res.status(404).json({ message: "Assignment answer not found" });
    }
    answer.grade = grade;
    await answer.save();

    const updatedAnswer = await AssignmentAnswer.findByPk(answer.id_answer, {
      include: [
        {
          model: Assignment,
          attributes: ["id_assignment", "title", "description"],
          include: {
            model: Subject,
            attributes: ["id_subject", "name"],
          }
        },
        {
          model: Student,
          attributes: ["id_student"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
            {
              model: Class,
              attributes: ["id_class", "class_number", "class_letter"],
            }
          ],
        },
      ],
    });

    const formattedAnswer = {
      idAnswer: updatedAnswer.id_answer,
      assignment: {
        idAssignment: updatedAnswer.Assignment.id_assignment,
        title: updatedAnswer.Assignment.title,
        description: updatedAnswer.Assignment.description,
        subject: {
          idSubject: updatedAnswer.Assignment.Subject.id_subject,
          name: updatedAnswer.Assignment.Subject.name,
        }
      },
      student: updatedAnswer.Student ? {
        idStudent: updatedAnswer.Student.id_student,
        class: updatedAnswer.Student.Class ? {
          idClass: updatedAnswer.Student.Class.id_class,
          classNumber: updatedAnswer.Student.Class.class_number,
          classLetter: updatedAnswer.Student.Class.class_letter,
        } : null,
        idUser: updatedAnswer.Student.User.id_user,
        firstName: updatedAnswer.Student.User.first_name,
        lastName: updatedAnswer.Student.User.last_name,
        middleName: updatedAnswer.Student.User.middle_name,
      } : null,
      grade: updatedAnswer.grade,
      submissionDate: updatedAnswer.submission_date,
      textAnswer: updatedAnswer.text_answer,
      fileLink: updatedAnswer.file_link,
    };

    res.status(200).json({ message: "Assignment answer updated successfully", data: formattedAnswer });
  } catch (error) {
    console.error("Error updating assignment answer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTestingAnswerGrade = async (req, res) => {
  const { idTestingAnswer } = req.params;
  const { grade } = req.body;
  try {
    const answer = await TestingAnswer.findByPk(idTestingAnswer);
    if (!answer) {
      return res.status(404).json({ message: "Testing answer not found" });
    }
    answer.grade = grade;
    await answer.save();

    const updatedAnswer = await TestingAnswer.findByPk(answer.id_testing_answer, {
      include: [
        {
          model: Testing,
          as: 'Testing',
          attributes: ["id_testing"],
          include: [
            {
                model: Assignment,
                attributes: ["id_assignment", "title", "description"],
                include: {
                    model: Subject,
                    attributes: ["id_subject", "name"],
                }
            }
          ]
        },
        {
          model: Student,
          attributes: ["id_student"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
            {
              model: Class,
              attributes: ["id_class", "class_number", "class_letter"],
            }
          ],
        },
      ],
    });

    const formattedAnswer = {
      idTestingAnswer: updatedAnswer.id_testing_answer,
      testing: {
        idTesting: updatedAnswer.Testing.id_testing,
        title: updatedAnswer.Testing.Assignment.title,
        description: updatedAnswer.Testing.Assignment.description,
        subject: {
          idSubject: updatedAnswer.Testing.Assignment.Subject.id_subject,
          subjectName: updatedAnswer.Testing.Assignment.Subject.name,
        }
      },
      student: updatedAnswer.Student ? {
        idStudent: updatedAnswer.Student.id_student,
        class: updatedAnswer.Student.Class ? {
          idClass: updatedAnswer.Student.Class.id_class,
          classNumber: updatedAnswer.Student.Class.class_number,
          classLetter: updatedAnswer.Student.Class.class_letter,
        } : null,
        idUser: updatedAnswer.Student.User.id_user,
        firstName: updatedAnswer.Student.User.first_name,
        lastName: updatedAnswer.Student.User.last_name,
        middleName: updatedAnswer.Student.User.middle_name,
      } : null,
      grade: updatedAnswer.grade,
      submissionDate: updatedAnswer.submission_date,
      fileLink: updatedAnswer.file_link,
    };

    res.status(200).json({ message: "Testing answer grade updated successfully", data: formattedAnswer });
  } catch (error) {
    console.error("Error updating testing answer grade:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAssignmentAnswers = async (req, res) => {
  const { idAssignment } = req.params;
  try {
    const answers = await AssignmentAnswer.findAll({
      where: { id_assignment: idAssignment },
      include: [
        {
          model: Assignment,
          attributes: ["id_assignment", "title"],
        },
        {
          model: Student,
          attributes: ["id_student"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
            {
              model: Class,
              attributes: ["id_class", "class_number", "class_letter"],
            }
          ],
        },
      ],
    });

    const formattedAnswers = answers.map(answer => ({
      idAnswer: answer.id_answer,
      assignment: {
        idAssignment: answer.Assignment.id_assignment,
        title: answer.Assignment.title,
      },
      student: answer.Student ? {
        idStudent: answer.Student.id_student,
        class: answer.Student.Class ? {
          idClass: answer.Student.Class.id_class,
          classNumber: answer.Student.Class.class_number,
          classLetter: answer.Student.Class.class_letter,
        } : null,
        idUser: answer.Student.User.id_user,
        firstName: answer.Student.User.first_name,
        lastName: answer.Student.User.last_name,
        middleName: answer.Student.User.middle_name,
      } : null,
      grade: answer.grade,
      submissionDate: answer.submission_date,
      textAnswer: answer.text_answer,
      fileLink: `${req.protocol}://${req.get("host")}${answer.file_link}`,
    }));

    res.status(200).json({ message: "Assignment answers fetched successfully", data: formattedAnswers });
  } catch (error) {
    console.error("Error fetching assignment answers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTestingAnswers = async (req, res) => {
  const { idTesting } = req.params;
  try {
    const answers = await TestingAnswer.findAll({
      where: { id_testing: idTesting },
      include: [
        {
          model: Testing,
          as: 'Testing',
          attributes: ["id_testing"],
          include: {
            model: Assignment,
            attributes: ["id_assignment", "title", "description"],
            include: {
              model: Subject,
              attributes: ["id_subject", "name"],
            }
          }
        },
        {
          model: Student,
          attributes: ["id_student"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
            {
              model: Class,
              attributes: ["id_class", "class_number", "class_letter"],
            }
          ],
        },
      ],
    });

    const formattedAnswers = answers.map(answer => ({
      idAnswer: answer.id_testing_answer,
      testing: {
        idTesting: answer.Testing.id_testing,
        title: answer.Testing.Assignment.title,
        description: answer.Testing.Assignment.description,
        subject: {
          idSubject: answer.Testing.Assignment.Subject.id_subject,
          name: answer.Testing.Assignment.Subject.name,
        },
      },
      student: answer.Student ? {
        idStudent: answer.Student.id_student,
        class: answer.Student.Class ? {
          idClass: answer.Student.Class.id_class,
          classNumber: answer.Student.Class.class_number,
          classLetter: answer.Student.Class.class_letter,
        } : null,
        idUser: answer.Student.User.id_user,
        firstName: answer.Student.User.first_name,
        lastName: answer.Student.User.last_name,
        middleName: answer.Student.User.middle_name,
      } : null,
      grade: answer.grade,
      submissionDate: answer.submission_date,
      fileLink: `${req.protocol}://${req.get("host")}${answer.file_link}`,
    }));

    res.status(200).json({ message: "Testing answers fetched successfully", data: formattedAnswers });
  } catch (error) {
    console.error("Error fetching testing answers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAssignmentAnswerById = async (req, res) => {
  const { idAnswer } = req.params;
  try {
    const answer = await AssignmentAnswer.findByPk(idAnswer, {
      include: [
        {
          model: Assignment,
          attributes: ["id_assignment", "title", "description"],
          include: {
            model: Subject,
            attributes: ["id_subject", "name"],
        }
        },
        {
          model: Student,
          attributes: ["id_student"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
            {
              model: Class,
              attributes: ["id_class", "class_number", "class_letter"],
            }
          ],
        },
      ],
    });

    if (!answer) {
      return res.status(404).json({ message: "Assignment answer not found" });
    }

    const formattedAnswer = {
      idAnswer: answer.id_answer,
      assignment: {
        idAssignment: answer.Assignment.id_assignment,
        title: answer.Assignment.title,
        description: answer.Assignment.description,
        subject: {
          idSubject: answer.Assignment.Subject.id_subject,
          name: answer.Assignment.Subject.name,
        }
      },
      student: answer.Student ? {
        idStudent: answer.Student.id_student,
        class: answer.Student.Class ? {
          idClass: answer.Student.Class.id_class,
          classNumber: answer.Student.Class.class_number,
          classLetter: answer.Student.Class.class_letter,
        } : null,
        idUser: answer.Student.User.id_user,
        firstName: answer.Student.User.first_name,
        lastName: answer.Student.User.last_name,
        middleName: answer.Student.User.middle_name,
      } : null,
      grade: answer.grade,
      submissionDate: answer.submission_date,
      textAnswer: answer.text_answer,
      fileLink: `${req.protocol}://${req.get("host")}${answer.file_link}`,
    };

    res.status(200).json({ message: "Assignment answer fetched successfully", data: formattedAnswer });
  } catch (error) {
    console.error("Error fetching assignment answer by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTestingAnswerById = async (req, res) => {
  const { idTestingAnswer } = req.params;
  try {
    const answer = await TestingAnswer.findByPk(idTestingAnswer, {
      include: [
        {
          model: Testing,
          as: 'Testing',
          attributes: ["id_testing"],
          include: [
            {
                model: Assignment,
                attributes: ["id_assignment", "title", "description"],
                include: {
                    model: Subject,
                    attributes: ["id_subject", "name"],
                }
            }
          ]
        },
        {
          model: Student,
          attributes: ["id_student"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
            {
              model: Class,
              attributes: ["id_class", "class_number", "class_letter"],
            }
          ],
        },
      ],
    });

    if (!answer) {
      return res.status(404).json({ message: "Testing answer not found" });
    }

    const formattedAnswer = {
      idAnswer: answer.id_testing_answer,
      testing: {
        idTesting: answer.Testing.id_testing,
        title: answer.Testing.Assignment.title,
        description: answer.Testing.Assignment.description,
        subject: {
          idSubject: answer.Testing.Assignment.Subject.id_subject,
          subjectName: answer.Testing.Assignment.Subject.name,
        }
      },
      student: answer.Student ? {
        idStudent: answer.Student.id_student,
        class: answer.Student.Class ? {
          idClass: answer.Student.Class.id_class,
          classNumber: answer.Student.Class.class_number,
          classLetter: answer.Student.Class.class_letter,
        } : null,
        idUser: answer.Student.User.id_user,
        firstName: answer.Student.User.first_name,
        lastName: answer.Student.User.last_name,
        middleName: answer.Student.User.middle_name,
      } : null,
      grade: answer.grade,
      submissionDate: answer.submission_date,
      fileLink: answer.file_link,
    };

    res.status(200).json({ message: "Testing answer fetched successfully", data: formattedAnswer });
  } catch (error) {
    console.error("Error fetching testing answer by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getStudentAssignmentAnswer = async (req, res) => {
  const { idAssignment, idStudent } = req.params;
  try {
    const answer = await AssignmentAnswer.findOne({
      where: {
        id_assignment: idAssignment,
        id_student: idStudent
      },
      include: [
        {
          model: Assignment,
          attributes: ["id_assignment", "title", "description", "file_link", "open_time", "close_time"],
          include: {
            model: Subject,
            attributes: ["id_subject", "name"],
          }
        },
        {
          model: Student,
          attributes: ["id_student"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
            {
              model: Class,
              attributes: ["id_class", "class_number", "class_letter"],
            }
          ],
        },
      ],
    });

    if (!answer) {
      return res.status(200).json();
    }

    const formattedAnswer = {
      idAnswer: answer.id_answer,
      assignment: {
        idAssignment: answer.Assignment.id_assignment,
        title: answer.Assignment.title,
        description: answer.Assignment.description,
        fileLink: answer.Assignment.file_link,
        openTime: answer.Assignment.open_time,
        closeTime: answer.Assignment.close_time,
        subject: {
          idSubject: answer.Assignment.Subject.id_subject,
          name: answer.Assignment.Subject.name,
        }
      },
      student: answer.Student ? {
        idStudent: answer.Student.id_student,
        class: answer.Student.Class ? {
          idClass: answer.Student.Class.id_class,
          classNumber: answer.Student.Class.class_number,
          classLetter: answer.Student.Class.class_letter,
        } : null,
        idUser: answer.Student.User.id_user,
        firstName: answer.Student.User.first_name,
        lastName: answer.Student.User.last_name,
        middleName: answer.Student.User.middle_name,
      } : null,
      grade: answer.grade,
      submissionDate: answer.submission_date,
      textAnswer: answer.text_answer,
      fileLink: `${req.protocol}://${req.get("host")}${answer.file_link}`,
    };

    res.status(200).json({ 
      message: "Student's assignment answer fetched successfully", 
      data: formattedAnswer 
    });
  } catch (error) {
    console.error("Error fetching student's assignment answer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getStudentTestingAnswer = async (req, res) => {
  const { idTesting, idStudent } = req.params;
  try {
    const answer = await TestingAnswer.findOne({
      where: {
        id_testing: idTesting,
        id_student: idStudent
      },
      include: [
        {
          model: Testing,
          as: 'Testing',
          attributes: ["id_testing", "file_link", "attempts_count"],
          include: {
            model: Assignment,
            attributes: ["id_assignment", "title", "description", "open_time", "close_time"],
            include: {
              model: Subject,
              attributes: ["id_subject", "name"],
            }
          }
        },
        {
          model: Student,
          attributes: ["id_student"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
            {
              model: Class,
              attributes: ["id_class", "class_number", "class_letter"],
            }
          ],
        },
      ],
    });

    if (!answer) {
      return res.status(200).json();
    }

    const formattedAnswer = {
      idTestingAnswer: answer.id_testing_answer,
      testing: {
        idTesting: answer.Testing.id_testing,
        fileLink: answer.Testing.file_link,
        attemptsCount: answer.Testing.attempts_count,
        assignment: {
          idAssignment: answer.Testing.Assignment.id_assignment,
          title: answer.Testing.Assignment.title,
          description: answer.Testing.Assignment.description,
          openTime: answer.Testing.Assignment.open_time,
          closeTime: answer.Testing.Assignment.close_time,
          subject: {
            idSubject: answer.Testing.Assignment.Subject.id_subject,
            name: answer.Testing.Assignment.Subject.name,
          }
        }
      },
      student: answer.Student ? {
        idStudent: answer.Student.id_student,
        class: answer.Student.Class ? {
          idClass: answer.Student.Class.id_class,
          classNumber: answer.Student.Class.class_number,
          classLetter: answer.Student.Class.class_letter,
        } : null,
        idUser: answer.Student.User.id_user,
        firstName: answer.Student.User.first_name,
        lastName: answer.Student.User.last_name,
        middleName: answer.Student.User.middle_name,
      } : null,
      grade: answer.grade,
      submissionDate: answer.submission_date,
      fileLink: `${req.protocol}://${req.get("host")}${answer.file_link}`,
    };

    res.status(200).json({ 
      message: "Student's testing answer fetched successfully", 
      data: formattedAnswer 
    });
  } catch (error) {
    console.error("Error fetching student's testing answer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = {
  createAssignmentAnswer,
  createTestingAnswer,
  updateAssignmentAnswer,
  updateTestingAnswerGrade,
  getAssignmentAnswers,
  getTestingAnswers,
  getAssignmentAnswerById,
  getTestingAnswerById,
  getStudentAssignmentAnswer,
  getStudentTestingAnswer,
};