const {
  EmployeeEducation,
  EducationLevel,
  EducationalInstitution,
  Specialty,
  Employee,
  User,
  sequelize,
} = require("../models");

const createEmployeeEducation = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      idEmployee,
      idEducationLevel,
      idEducationalInstitution,
      idSpecialty,
      graduationYear,
    } = req.body;

    // Проверка наличия обязательных полей
    if (
      !idEmployee ||
      !idEducationLevel ||
      !idEducationalInstitution ||
      !idSpecialty ||
      !graduationYear
    ) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Создание записи об образовании сотрудника
    const employeeEducation = await EmployeeEducation.create(
      {
        id_employee: idEmployee,
        id_education_level: idEducationLevel,
        id_educational_institution: idEducationalInstitution,
        id_specialty: idSpecialty,
        graduation_year: graduationYear,
      },
      { transaction }
    );

    await transaction.commit();

    // Получение связанных данных сотрудника
    const fullEmployeeEducation = await EmployeeEducation.findByPk(
      employeeEducation.id_employee_education,
      {
        include: [
          {
            model: Employee,
            include: {
              model: User,
              attributes: ["first_name", "last_name", "middle_name"],
            },
          },
          {
            model: EducationLevel,
            attributes: ["id_education_level", "name"],
          },
          {
            model: EducationalInstitution,
            attributes: ["id_educational_institution", "name"],
          },
          {
            model: Specialty,
            attributes: ["id_specialty", "name"],
          },
        ],
      }
    );

    const formattedEmployeeEducation = {
      idEmployeeEducation: fullEmployeeEducation.id_employee_education,
      employee: {
        idEmployee: fullEmployeeEducation.Employee.id_employee,
        firstName: fullEmployeeEducation.Employee.User.first_name,
        lastName: fullEmployeeEducation.Employee.User.last_name,
        middleName: fullEmployeeEducation.Employee.User.middle_name,
      },
      educationLevel: {
        idEducationLevel: fullEmployeeEducation.id_education_level,
        name: fullEmployeeEducation.EducationLevel.name,
      },
      educationalInstitution: {
        idEducationalInstitution:
          fullEmployeeEducation.id_educational_institution,
        name: fullEmployeeEducation.EducationalInstitution.name,
      },
      specialty: {
        idSpecialty: fullEmployeeEducation.id_specialty,
        name: fullEmployeeEducation.Specialty.name,
      },
      graduationYear: fullEmployeeEducation.graduation_year,
    };

    res.status(201).json({
      message: "Education record created successfully",
      employeeEducation: formattedEmployeeEducation,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error creating employee education:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const deleteEmployeeEducationById = async (req, res) => {
  const { idEmployeeEducation } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const employeeEducation = await EmployeeEducation.findByPk(
      idEmployeeEducation
    );

    if (!employeeEducation) {
      return res.status(404).json({ message: "Education record not found" });
    }

    await employeeEducation.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Education record deleted successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error deleting employee education:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateEmployeeEducationById = async (req, res) => {
  const { idEmployeeEducation } = req.params;
  const {
    idEducationLevel,
    idEducationalInstitution,
    idSpecialty,
    graduationYear,
  } = req.body;
  const transaction = await sequelize.transaction();
  try {
    // Проверка наличия обязательных полей
    if (
      !idEducationLevel ||
      !idEducationalInstitution ||
      !idSpecialty ||
      !graduationYear
    ) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const employeeEducation = await EmployeeEducation.findByPk(
      idEmployeeEducation,
      {
        include: [
          {
            model: Employee,
            include: {
              model: User,
              attributes: ["first_name", "last_name", "middle_name"],
            },
          },
          {
            model: EducationLevel,
            attributes: ["id_education_level", "name"],
          },
          {
            model: EducationalInstitution,
            attributes: ["id_educational_institution", "name"],
          },
          {
            model: Specialty,
            attributes: ["id_specialty", "name"],
          },
        ],
      }
    );

    if (!employeeEducation) {
      return res.status(404).json({ message: "Education record not found" });
    }

    employeeEducation.id_education_level = idEducationLevel;
    employeeEducation.id_educational_institution = idEducationalInstitution;
    employeeEducation.id_specialty = idSpecialty;
    employeeEducation.graduation_year = graduationYear;

    await employeeEducation.save({ transaction });
    await transaction.commit();

    const formattedEmployeeEducation = {
      idEmployeeEducation: employeeEducation.id_employee_education,
      employee: {
        idEmployee: employeeEducation.Employee.id_employee,
        firstName: employeeEducation.Employee.User.first_name,
        lastName: employeeEducation.Employee.User.last_name,
        middleName: employeeEducation.Employee.User.middle_name,
      },
      educationLevel: {
        idEducationLevel: employeeEducation.id_education_level,
        name: employeeEducation.EducationLevel.name,
      },
      educationalInstitution: {
        idEducationalInstitution: employeeEducation.id_educational_institution,
        name: employeeEducation.EducationalInstitution.name,
      },
      specialty: {
        idSpecialty: employeeEducation.id_specialty,
        name: employeeEducation.Specialty.name,
      },
      graduationYear: employeeEducation.graduation_year,
    };

    res.status(200).json({
      message: "Education record updated successfully",
      employeeEducation: formattedEmployeeEducation,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error updating employee education:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getEmployeeEducationsByEmployeeId = async (req, res) => {
  const { idEmployee } = req.params;
  try {
    const employeeEducations = await EmployeeEducation.findAll({
      where: { id_employee: idEmployee },
      include: [
        { model: EducationLevel, attributes: ["id_education_level", "name"] },
        {
          model: EducationalInstitution,
          attributes: ["id_educational_institution", "name"],
        },
        { model: Specialty, attributes: ["id_specialty", "name"] },
        {
          model: Employee,
          attributes: ["id_employee"],
          include: {
            model: User,
            attributes: ["first_name", "last_name", "middle_name"],
          },
        },
      ],
    });
    const formattedEmployeeEducations = employeeEducations.map((education) => ({
      idEmployeeEducation: education.id_employee_education,
      employee: {
        idEmployee: education.Employee.id_employee,
        firstName: education.Employee.User.first_name,
        lastName: education.Employee.User.last_name,
        middleName: education.Employee.User.middle_name,
      },
      educationLevel: {
        idEducationLevel: education.EducationLevel.id_education_level,
        name: education.EducationLevel.name,
      },
      educationalInstitution: {
        idEducationalInstitution:
          education.EducationalInstitution.id_educational_institution,
        name: education.EducationalInstitution.name,
      },
      specialty: {
        idSpecialty: education.Specialty.id_specialty,
        name: education.Specialty.name,
      },
      graduationYear: education.graduation_year,
    }));
    res.status(200).json({
      message: "Employee educations fetched successfully",
      employeeEducation: formattedEmployeeEducations,
    });
  } catch (error) {
    console.error("Error fetching employee educations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllEducationSettings = async (req, res) => {
    try {
      const educationLevels = await EducationLevel.findAll({
        attributes: ["id_education_level", "name"]
      });
      const educationalInstitutions = await EducationalInstitution.findAll({
        attributes: ["id_educational_institution", "name"]
      });
      const specialties = await Specialty.findAll({
        attributes: ["id_specialty", "name"]
      });
  
      const formattedEducationLevels = educationLevels.map(level => ({
        idEducationLevel: level.id_education_level,
        name: level.name
      }));
  
      const formattedEducationalInstitutions = educationalInstitutions.map(institution => ({
        idEducationalInstitution: institution.id_educational_institution,
        name: institution.name
      }));
  
      const formattedSpecialties = specialties.map(specialty => ({
        idSpecialty: specialty.id_specialty,
        name: specialty.name
      }));
  
      res.status(200).json({
        message: "Education settings fetched successfully",
        educationLevels: formattedEducationLevels,
        educationalInstitutions: formattedEducationalInstitutions,
        specialties: formattedSpecialties,
      });
    } catch (error) {
      console.error("Error fetching education settings:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

module.exports = {
  createEmployeeEducation,
  deleteEmployeeEducationById,
  updateEmployeeEducationById,
  getEmployeeEducationsByEmployeeId,
  getAllEducationSettings,
};
