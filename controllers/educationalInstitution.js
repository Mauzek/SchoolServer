const { EducationalInstitution, sequelize } = require("../models");

const createEducationalInstitution = async (req, res) => {
  const transaction = await sequelize.transaction();
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Institution name is required" });
    }

    // Check if the institution name already exists
    const existingInstitution = await EducationalInstitution.findOne({ where: { name } });
    if (existingInstitution) {
      return res.status(400).json({ message: "Institution with this name already exists" });
    }

    const educationalInstitution = await EducationalInstitution.create({ name }, { transaction });
    await transaction.commit();

    const formattedEducationalInstitution = {
      idEducationalInstitution: educationalInstitution.id_educational_institution,
      name: educationalInstitution.name,
    };
    res.status(201).json({ message: "Institution created successfully", institution: formattedEducationalInstitution });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error creating educational institution:", error);
    res.status(400).json({ message: "Validation error", error: error.message });
  }
};

const deleteEducationalInstitutionById = async (req, res) => {
  const { idEducationalInstitution } = req.params;
  try {
    const educationalInstitution = await EducationalInstitution.findByPk(idEducationalInstitution);
    if (!educationalInstitution) {
      return res.status(404).json({ message: "Educational institution not found" });
    }
    await educationalInstitution.destroy();
    res.status(200).json({ message: "Educational institution deleted successfully" });
  } catch (error) {
    console.error("Error deleting educational institution:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateEducationalInstitutionById = async (req, res) => {
  const { idEducationalInstitution } = req.params;
  const { name } = req.body;
  const transaction = await sequelize.transaction();
  try {
    if(!name) {
      return res.status(400).json({ message: "Institution name is required" });
    }
    const educationalInstitution = await EducationalInstitution.findByPk(idEducationalInstitution);
    if (!educationalInstitution) {
      return res.status(404).json({ message: "Educational institution not found" });
    }
    educationalInstitution.name = name;
    await educationalInstitution.save({ transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Educational institution updated successfully",
      educationalInstitution: {
        idEducationalInstitution: educationalInstitution.id_educational_institution,
        name: educationalInstitution.name,
      },
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error updating educational institution:", error);
    res.status(400).json({ message: "Validation error", error: error.message });
  }
};

const getAllEducationalInstitutions = async (req, res) => {
  try {
    const educationalInstitutions = await EducationalInstitution.findAll();
    const formattedEducationalInstitutions = educationalInstitutions.map((institution) => ({
      idEducationalInstitution: institution.id_educational_institution,
      name: institution.name,
    }));
    res.status(200).json(formattedEducationalInstitutions);
  } catch (error) {
    console.error("Error fetching educational institutions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEducationalInstitution,
  deleteEducationalInstitutionById,
  updateEducationalInstitutionById,
  getAllEducationalInstitutions,
};