const { Specialty, sequelize } = require("../models");

const createSpecialty = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Specialty name is required" });
    }
    const specialty = await Specialty.create({ name }, { transaction });
    await transaction.commit();

    const formattedSpecialty = {
      idSpecialty: specialty.id_specialty,
      name: specialty.name,
    };
    res.status(201).json({
      message: "Specialty created successfully",
      specialty: formattedSpecialty,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error creating specialty:", error);
    res.status(400).json({ message: "Validation error", error: error.message });
  }
};

const deleteSpecialtyById = async (req, res) => {
  const { idSpecialty } = req.params;
  try {
    const specialty = await Specialty.findByPk(idSpecialty);
    if (!specialty) {
      return res.status(404).json({ message: "Specialty not found" });
    }
    await specialty.destroy();
    res.status(200).json({ message: "Specialty deleted successfully" });
  } catch (error) {
    console.error("Error deleting specialty:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSpecialtyById = async (req, res) => {
  const { idSpecialty } = req.params;
  const { name } = req.body;
  const transaction = await sequelize.transaction();
  try {
    if (!name) {
      return res.status(400).json({ message: "Specialty name is required" });
    }
    const specialty = await Specialty.findByPk(idSpecialty);
    if (!specialty) {
      return res.status(404).json({ message: "Specialty not found" });
    }
    specialty.name = name;
    await specialty.save({ transaction });
    await transaction.commit();

    const formattedSpecialty = {
      idSpecialty: specialty.id_specialty,
      name: specialty.name,
    };
    res.status(200).json({
      message: "Specialty updated successfully",
      specialty: formattedSpecialty,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error updating specialty:", error);
    res.status(400).json({ message: "Validation error", error: error.message });
  }
};

const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.findAll();
    const formattedSpecialties = specialties.map((specialty) => ({
      idSpecialty: specialty.id_specialty,
      name: specialty.name,
    }));
    res.status(200).json(formattedSpecialties);
  } catch (error) {
    console.error("Error fetching specialties:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createSpecialty,
  deleteSpecialtyById,
  updateSpecialtyById,
  getAllSpecialties,
};