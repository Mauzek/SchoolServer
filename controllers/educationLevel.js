const { EducationLevel, sequelize } = require("../models");

const createEducationLevel = async (req, res) => {
  const transaction = await sequelize.transaction();
  const { name } = req.body;
  try {
    if(!name) {
      return res.status(400).json({ message: "Education level name is required" });
    }
    const educationLevel = await EducationLevel.create(
      { name },
      { transaction }
    );
    await transaction.commit();

    const formattedEducationLevel = {
      idEducationLevel: educationLevel.id_education_level,
      name: educationLevel.name,
    };
    res.status(201).json(formattedEducationLevel);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error creating education level:", error);
    res.status(400).json({ message: "Validation error", error: error.message });
  }
};

const deleteEducationLevelById = async (req, res) => {
  const { idEducationLevel } = req.params;
  try {
    const educationLevel = await EducationLevel.findByPk(idEducationLevel);
    if (!educationLevel) {
      return res.status(404).json({ message: "Education level not found" });
    }
    await educationLevel.destroy();
    res.status(200).json({ message: "Education level deleted successfully" });
  } catch (error) {
    console.error("Error deleting education level:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateEducationLevelById = async (req, res) => {
  const { idEducationLevel } = req.params;
  const { name } = req.body;
  const transaction = await sequelize.transaction();
  try {
    if(!name) {
      return res.status(400).json({ message: "Education level name is required" });
    }
    const educationLevel = await EducationLevel.findByPk(idEducationLevel);
    if (!educationLevel) {
      return res.status(404).json({ message: "Education level not found" });
    }
    educationLevel.name = name;
    await educationLevel.save({ transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Education level updated successfully",
      educationLevel: {
        idEducationLevel: educationLevel.id_education_level,
        name: educationLevel.name,
      },
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error updating education level:", error);
    res.status(400).json({ message: "Validation error", error: error.message });
  }
};

const getAllEducationLevels = async (req, res) => {
  try {
    const educationLevels = await EducationLevel.findAll();
    const formattedEducationLevels = educationLevels.map((level) => ({
      idEducationLevel: level.id_education_level,
      name: level.name,
    }));
    res.status(200).json(formattedEducationLevels);
  } catch (error) {
    console.error("Error fetching education levels:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEducationLevel,
  deleteEducationLevelById,
  updateEducationLevelById,
  getAllEducationLevels,
};
