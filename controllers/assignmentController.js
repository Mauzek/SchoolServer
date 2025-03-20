const {
  Assignment,
  Testing,
  Subject,
  Class,
  Employee,
  User,
} = require("../models");

const createAssignment = async (req, res) => {
  const {
    idSubject,
    idClass,
    idEmployee,
    title,
    description,
    fileLink,
    openTime,
    closeTime,
    isTesting,
    testingFileLink,
    attemptsCount,
  } = req.body;
  try {
    const assignment = await Assignment.create({
      id_subject: idSubject,
      id_class: idClass,
      id_employee: idEmployee,
      title,
      description,
      file_link: fileLink,
      open_time: openTime,
      close_time: closeTime,
    });

    if (isTesting) {
      await Testing.create({
        id_assignment: assignment.id_assignment,
        file_link: testingFileLink,
        attempts_count: attemptsCount,
      });
    }

    const createdAssignment = await Assignment.findByPk(
      assignment.id_assignment,
      {
        include: [
          {
            model: Subject,
            attributes: ["id_subject", "name"],
          },
          {
            model: Class,
            attributes: ["id_class", "class_number", "class_letter"],
          },
          {
            model: Employee,
            attributes: ["id_employee"],
            include: [
              {
                model: User,
                attributes: [
                  "id_user",
                  "first_name",
                  "last_name",
                  "middle_name",
                ],
              },
            ],
          },
          {
            model: Testing,
            attributes: ["id_testing", "file_link", "attempts_count"],
          },
        ],
      }
    );

    const formattedAssignment = {
      idAssignment: createdAssignment.id_assignment,
      subject: {
        idSubject: createdAssignment.Subject.id_subject,
        subjectName: createdAssignment.Subject.name,
      },
      class: createdAssignment.Class
        ? {
            idClass: createdAssignment.Class.id_class,
            classNumber: createdAssignment.Class.class_number,
            classLetter: createdAssignment.Class.class_letter,
          }
        : null,
      employee: createdAssignment.Employee
        ? {
            idEmployee: createdAssignment.Employee.id_employee,
            user: createdAssignment.Employee.User
              ? {
                  idUser: createdAssignment.Employee.User.id_user,
                  firstName: createdAssignment.Employee.User.first_name,
                  lastName: createdAssignment.Employee.User.last_name,
                  middleName: createdAssignment.Employee.User.middle_name,
                }
              : null,
          }
        : null,
      title: createdAssignment.title,
      description: createdAssignment.description,
      fileLink: createdAssignment.file_link,
      openTime: createdAssignment.open_time,
      closeTime: createdAssignment.close_time,
      testing: createdAssignment.Testing
        ? {
            idTesting: createdAssignment.Testing.id_testing,
            fileLink: createdAssignment.Testing.file_link,
            attemptsCount: createdAssignment.Testing.attempts_count,
          }
        : null,
    };

    res.status(201).json({
      message: "Assignment created successfully",
      data: formattedAssignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteAssignmentById = async (req, res) => {
  const { idAssignment } = req.params;
  try {
    const assignment = await Assignment.findByPk(idAssignment);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    await assignment.destroy();
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateAssignmentById = async (req, res) => {
  const { idAssignment } = req.params;
  const {
    idSubject,
    idClass,
    idEmployee,
    title,
    description,
    fileLink,
    openTime,
    closeTime,
    isTesting,
    testingFileLink,
    attemptsCount,
  } = req.body;
  try {
    const assignment = await Assignment.findByPk(idAssignment);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    assignment.id_subject = idSubject;
    assignment.id_class = idClass;
    assignment.id_employee = idEmployee;
    assignment.title = title;
    assignment.description = description;
    assignment.file_link = fileLink;
    assignment.open_time = openTime;
    assignment.close_time = closeTime;
    await assignment.save();

    if (isTesting) {
      let testing = await Testing.findOne({
        where: { id_assignment: idAssignment },
      });
      if (testing) {
        testing.file_link = testingFileLink;
        testing.attempts_count = attemptsCount;
        await testing.save();
      } else {
        await Testing.create({
          id_assignment: idAssignment,
          file_link: testingFileLink,
          attempts_count: attemptsCount,
        });
      }
    }

    const updatedAssignment = await Assignment.findByPk(
      assignment.id_assignment,
      {
        include: [
          {
            model: Subject,
            attributes: ["id_subject", "name"],
          },
          {
            model: Class,
            attributes: ["id_class", "class_number", "class_letter"],
          },
          {
            model: Employee,
            attributes: ["id_employee"],
            include: [
              {
                model: User,
                attributes: [
                  "id_user",
                  "first_name",
                  "last_name",
                  "middle_name",
                ],
              },
            ],
          },
          {
            model: Testing,
            attributes: ["id_testing", "file_link", "attempts_count"],
          },
        ],
      }
    );

    const formattedAssignment = {
      idAssignment: updatedAssignment.id_assignment,
      subject: {
        idSubject: updatedAssignment.Subject.id_subject,
        subjectName: updatedAssignment.Subject.name,
      },
      class: updatedAssignment.Class
        ? {
            idClass: updatedAssignment.Class.id_class,
            classNumber: updatedAssignment.Class.class_number,
            classLetter: updatedAssignment.Class.class_letter,
          }
        : null,
      employee: updatedAssignment.Employee
        ? {
            idEmployee: updatedAssignment.Employee.id_employee,
            user: updatedAssignment.Employee.User
              ? {
                  idUser: updatedAssignment.Employee.User.id_user,
                  firstName: updatedAssignment.Employee.User.first_name,
                  lastName: updatedAssignment.Employee.User.last_name,
                  middleName: updatedAssignment.Employee.User.middle_name,
                }
              : null,
          }
        : null,
      title: updatedAssignment.title,
      description: updatedAssignment.description,
      fileLink: updatedAssignment.file_link,
      openTime: updatedAssignment.open_time,
      closeTime: updatedAssignment.close_time,
      testing: updatedAssignment.Testing
        ? {
            idTesting: updatedAssignment.Testing.id_testing,
            fileLink: updatedAssignment.Testing.file_link,
            attemptsCount: updatedAssignment.Testing.attempts_count,
          }
        : null,
    };

    res.status(200).json({
      message: "Assignment updated successfully",
      data: formattedAssignment,
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAssignmentsBySubjectId = async (req, res) => {
  const { idSubject } = req.params;
  try {
    const assignments = await Assignment.findAll({
      where: { id_subject: idSubject },
      include: [
        {
          model: Subject,
          attributes: ["id_subject", "name"],
        },
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
        },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Testing,
          attributes: ["id_testing", "file_link", "attempts_count"],
        },
      ],
    });

    const formattedAssignments = assignments.map((assignment) => ({
      idAssignment: assignment.id_assignment,
      subject: {
        idSubject: assignment.Subject.id_subject,
        subjectName: assignment.Subject.name,
      },
      class: {
        idClass: assignment.Class.id_class,
        classNumber: assignment.Class.class_number,
        classLetter: assignment.Class.class_letter,
      },
      employee: {
        idEmployee: assignment.Employee.id_employee,
        firstName: assignment.Employee.User.first_name,
        lastName: assignment.Employee.User.last_name,
        middleName: assignment.Employee.User.middle_name,
      },
      title: assignment.title,
      description: assignment.description,
      fileLink: assignment.file_link,
      openTime: assignment.open_time,
      closeTime: assignment.close_time,
      testing: assignment.Testing
        ? {
            idTesting: assignment.Testing.id_testing,
            fileLink: assignment.Testing.file_link,
            attemptsCount: assignment.Testing.attempts_count,
          }
        : null,
    }));

    res.status(200).json({
      message: "Assignments fetched successfully",
      data: formattedAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignments by subject ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAssignmentById = async (req, res) => {
  const { idAssignment } = req.params;
  try {
    const assignment = await Assignment.findByPk(idAssignment, {
      include: [
        {
          model: Subject,
          attributes: ["id_subject", "name", "description"],
        },
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
        },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Testing,
          attributes: ["id_testing", "file_link", "attempts_count"],
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const formattedAssignment = {
      idAssignment: assignment.id_assignment,
      subject: {
        idSubject: assignment.Subject.id_subject,
        name: assignment.Subject.name,
        description: assignment.Subject.description,
      },
      class: {
        idClass: assignment.Class.id_class,
        classNumber: assignment.Class.class_number,
        classLetter: assignment.Class.class_letter,
      },
      employee: {
        idEmployee: assignment.Employee.id_employee,
        firstName: assignment.Employee.User.first_name,
        lastName: assignment.Employee.User.last_name,
        middleName: assignment.Employee.User.middle_name,
      },
      title: assignment.title,
      description: assignment.description,
      fileLink: assignment.file_link,
      openTime: assignment.open_time,
      closeTime: assignment.close_time,
      testing: assignment.Testing
        ? {
            idTesting: assignment.Testing.id_testing,
            fileLink: assignment.Testing.file_link,
            attemptsCount: assignment.Testing.attempts_count,
          }
        : null,
    };

    res.status(200).json({
      message: "Assignment fetched successfully",
      data: formattedAssignment,
    });
  } catch (error) {
    console.error("Error fetching assignment by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAssignmentsByClassId = async (req, res) => {
  const { idClass } = req.params;
  try {
    const assignments = await Assignment.findAll({
      where: { id_class: idClass },
      include: [
        {
          model: Subject,
          attributes: ["id_subject", "name"],
        },
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
        },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Testing,
          attributes: ["id_testing", "file_link", "attempts_count"],
        },
      ],
    });

    const formattedAssignments = assignments.map((assignment) => ({
      idAssignment: assignment.id_assignment,
      subject: {
        idSubject: assignment.Subject.id_subject,
        subjectName: assignment.Subject.name,
      },
      class: {
        idClass: assignment.Class.id_class,
        classNumber: assignment.Class.class_number,
        classLetter: assignment.Class.class_letter,
      },
      employee: {
        idEmployee: assignment.Employee.id_employee,
        firstName: assignment.Employee.User.first_name,
        lastName: assignment.Employee.User.last_name,
        middleName: assignment.Employee.User.middle_name,
      },
      title: assignment.title,
      description: assignment.description,
      fileLink: assignment.file_link,
      openTime: assignment.open_time,
      closeTime: assignment.close_time,
      testing: assignment.Testing
        ? {
            idTesting: assignment.Testing.id_testing,
            fileLink: assignment.Testing.file_link,
            attemptsCount: assignment.Testing.attempts_count,
          }
        : null,
    }));

    res.status(200).json({
      message: "Assignments fetched successfully",
      data: formattedAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignments by class ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAssignmentsBySubjectAndClassId = async (req, res) => {
  const { idSubject, idClass } = req.params;
  try {
    const assignments = await Assignment.findAll({
      where: { id_subject: idSubject, id_class: idClass },
      include: [
        {
          model: Subject,
          attributes: ["id_subject", "name"],
        },
        {
          model: Class,
          attributes: ["id_class", "class_number", "class_letter"],
        },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["id_user", "first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Testing,
          attributes: ["id_testing", "file_link", "attempts_count"],
        },
      ],
    });

    const formattedAssignments = assignments.map((assignment) => ({
      idAssignment: assignment.id_assignment,
      subject: {
        idSubject: assignment.Subject.id_subject,
        subjectName: assignment.Subject.name,
      },
      class: {
        idClass: assignment.Class.id_class,
        classNumber: assignment.Class.class_number,
        classLetter: assignment.Class.class_letter,
      },
      employee: {
        idEmployee: assignment.Employee.id_employee,
        firstName: assignment.Employee.User.first_name,
        lastName: assignment.Employee.User.last_name,
        middleName: assignment.Employee.User.middle_name,
      },
      title: assignment.title,
      description: assignment.description,
      fileLink: assignment.file_link,
      openTime: assignment.open_time,
      closeTime: assignment.close_time,
      testing: assignment.Testing
        ? {
            idTesting: assignment.Testing.id_testing,
            fileLink: assignment.Testing.file_link,
            attemptsCount: assignment.Testing.attempts_count,
          }
        : null,
    }));

    res.status(200).json({
      message: "Assignments fetched successfully",
      data: formattedAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignments by subject and class ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = {
  createAssignment,
  deleteAssignmentById,
  updateAssignmentById,
  getAssignmentsBySubjectId,
  getAssignmentById,
  getAssignmentsByClassId,
  getAssignmentsBySubjectAndClassId,
};
