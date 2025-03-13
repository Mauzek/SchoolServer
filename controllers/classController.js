const { Class, Employee, Student, User, sequelize } = require("../models");

const getClassById = async (req, res) => {
  const { idClass } = req.params;
  try {
    const classData = await Class.findByPk(idClass, {
      include: [
        {
          model: Employee,
          as: 'ClassTeacher',
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Student,
          as: 'Students',
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("Students.id_student")), "studentCount"],
        ],
      },
      group: ["Class.id_class", "ClassTeacher.id_employee", "ClassTeacher->User.id_user"],
    });
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const formattedClass = {
      idClass: classData.id_class,
      classNumber: classData.class_number,
      classLetter: classData.class_letter,
      studyYear: classData.study_year,
      classTeacher: classData.ClassTeacher ? {
        id: classData.ClassTeacher.id_employee,
        firstName: classData.ClassTeacher.User ? classData.ClassTeacher.User.first_name : null,
        lastName: classData.ClassTeacher.User ? classData.ClassTeacher.User.last_name : null,
        middleName: classData.ClassTeacher.User ? classData.ClassTeacher.User.middle_name : null,
      } : null,
      studentCount: classData.get("studentCount"),
    };

    res.status(200).json({ message: "Class fetched successfully", class: formattedClass });
  } catch (error) {
    console.error("Error fetching class by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getClassByNumberAndLetter = async (req, res) => {
  const { classNumberAndLetter } = req.params;
  const classNumber = parseInt(classNumberAndLetter.match(/\d+/)[0], 10);
  const classLetter = classNumberAndLetter.match(/[^\d]+/)[0];
  try {
    const classData = await Class.findOne({
      where: {
        class_number: classNumber,
        class_letter: classLetter,
      },
      include: [
        {
          model: Employee,
          as: 'ClassTeacher',
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Student,
          as: 'Students',
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("Students.id_student")), "studentCount"],
        ],
      },
      group: ["Class.id_class", "ClassTeacher.id_employee", "ClassTeacher->User.id_user"],
    });
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const formattedClass = {
      idClass: classData.id_class,
      classNumber: classData.class_number,
      classLetter: classData.class_letter,
      studyYear: classData.study_year,
      classTeacher: classData.ClassTeacher ? {
        id: classData.ClassTeacher.id_employee,
        firstName: classData.ClassTeacher.User ? classData.ClassTeacher.User.first_name : null,
        lastName: classData.ClassTeacher.User ? classData.ClassTeacher.User.last_name : null,
        middleName: classData.ClassTeacher.User ? classData.ClassTeacher.User.middle_name : null,
      } : null,
      studentCount: classData.get("studentCount"),
    };

    res.status(200).json({ message: "Class fetched successfully", class: formattedClass });
  } catch (error) {
    console.error("Error fetching class by number and letter:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getClassesByEmployeeId = async (req, res) => {
  const { idEmployee } = req.params;
  try {
    const classes = await Class.findAll({
      where: { id_employee: idEmployee },
      include: [
        {
          model: Employee,
          as: 'ClassTeacher',
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Student,
          as: 'Students',
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("Students.id_student")), "studentCount"],
        ],
      },
      group: ["Class.id_class", "ClassTeacher.id_employee", "ClassTeacher->User.id_user"],
    });

    const formattedClasses = classes.map(classData => ({
      idClass: classData.id_class,
      classNumber: classData.class_number,
      classLetter: classData.class_letter,
      studyYear: classData.study_year,
      classTeacher: classData.ClassTeacher ? {
        id: classData.ClassTeacher.id_employee,
        firstName: classData.ClassTeacher.User ? classData.ClassTeacher.User.first_name : null,
        lastName: classData.ClassTeacher.User ? classData.ClassTeacher.User.last_name : null,
        middleName: classData.ClassTeacher.User ? classData.ClassTeacher.User.middle_name : null,
      } : null,
      studentCount: classData.get("studentCount"),
    }));

    res.status(200).json({ message: "Classes fetched successfully", classes: formattedClasses });
  } catch (error) {
    console.error("Error fetching classes by employee ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Employee,
          as: 'ClassTeacher',
          attributes: ["id_employee"],
          include: [
            {
              model: User,
              attributes: ["first_name", "last_name", "middle_name"],
            },
          ],
        },
        {
          model: Student,
          as: 'Students',
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("Students.id_student")), "studentCount"],
        ],
      },
      group: ["Class.id_class", "ClassTeacher.id_employee", "ClassTeacher->User.id_user"],
    });

    const formattedClasses = classes.map(classData => ({
      idClass: classData.id_class,
      classNumber: classData.class_number,
      classLetter: classData.class_letter,
      studyYear: classData.study_year,
      classTeacher: classData.ClassTeacher ? {
        id: classData.ClassTeacher.id_employee,
        firstName: classData.ClassTeacher.User ? classData.ClassTeacher.User.first_name : null,
        lastName: classData.ClassTeacher.User ? classData.ClassTeacher.User.last_name : null,
        middleName: classData.ClassTeacher.User ? classData.ClassTeacher.User.middle_name : null,
      } : null,
      studentCount: classData.get("studentCount"),
    }));

    res.status(200).json({ message: "All classes fetched successfully", classes: formattedClasses });
  } catch (error) {
    console.error("Error fetching all classes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createClass = async (req, res) => {
  const transaction = await sequelize.transaction();
  const { classNumber, classLetter, studyYear, idEmployee } = req.body;
  try {
    if (!classNumber || !classLetter || !studyYear) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const classData = await Class.create(
      { class_number: classNumber, class_letter: classLetter, study_year: studyYear, id_employee: idEmployee },
      { transaction }
    );
    await transaction.commit();

    res.status(201).json({ message: "Class created successfully", class: classData });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteClassById = async (req, res) => {
  const { idClass } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const classData = await Class.findByPk(idClass);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    await classData.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error deleting class:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateClassById = async (req, res) => {
  const { idClass } = req.params;
  const { classNumber, classLetter, studyYear, idEmployee } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const classData = await Class.findByPk(idClass);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    classData.class_number = classNumber;
    classData.class_letter = classLetter;
    classData.study_year = studyYear;
    classData.id_employee = idEmployee;
    await classData.save({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Class updated successfully", class: classData });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error updating class:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getClassById,
  getClassByNumberAndLetter,
  getClassesByEmployeeId,
  getAllClasses,
  createClass,
  deleteClassById,
  updateClassById,
};