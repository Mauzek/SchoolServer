const { Position, sequelize } = require("../models");

const getAllPositions = async (req, res) => {
  try {
    const positions = await Position.findAll({
      attributes: ["id_position", "name", "description"],
    });

    const formattedPositions = positions.map(position => ({
      idPosition: position.id_position,
      name: position.name,
      description: position.description,
    }));

    res.status(200).json({
      message: "Positions fetched successfully",
      positions: formattedPositions,
    });
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createPosition = async (req, res) => {
  const transaction = await sequelize.transaction();
  const { name, description } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Position name is required" });
    }

    // Check if the position name already exists
    const existingPosition = await Position.findOne({ where: { name } });
    if (existingPosition) {
      return res.status(400).json({ message: "Position name already exists" });
    }

    const position = await Position.create({ name, description }, { transaction });
    await transaction.commit();

    const formattedPosition = {
      idPosition: position.id_position,
      name: position.name,
      description: position.description,
    };
    res.status(201).json({ message: "Position created successfully", position: formattedPosition });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error creating position:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deletePositionById = async (req, res) => {
  const { idPosition } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const position = await Position.findByPk(idPosition);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    await position.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Position deleted successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error deleting position:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePositionById = async (req, res) => {
  const { idPosition } = req.params;
  const { name, description } = req.body;
  const transaction = await sequelize.transaction();
  try {

    const position = await Position.findByPk(idPosition);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    position.name = name;
    if(description) {
      position.description = description;
    }
    await position.save({ transaction });
    await transaction.commit();

    const formattedPosition = {
      idPosition: position.id_position,
      name: position.name,
      description: position.description,
    };
    res.status(200).json({ message: "Position updated successfully", position: formattedPosition });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error updating position:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllPositions,
  createPosition,
  deletePositionById,
  updatePositionById,
};