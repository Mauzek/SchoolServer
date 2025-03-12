const { Subject, SubjectTextbook, sequelize } = require("../models");

const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      attributes: ["id_subject", "name", "description"],
    });

    const formattedSubjects = subjects.map(subject => ({
      idSubject: subject.id_subject,
      name: subject.name,
      description: subject.description,
    }));

    res.status(200).json({
      message: "Subjects fetched successfully",
      subjects: formattedSubjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createSubject = async (req, res) => {
  const transaction = await sequelize.transaction();
  const { name, description } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    // Check if the subject name already exists
    const existingSubject = await Subject.findOne({ where: { name } });
    if (existingSubject) {
      return res.status(400).json({ message: "Subject name already exists" });
    }

    const subject = await Subject.create({ name, description }, { transaction });
    await transaction.commit();

    const formattedSubject = {
      idSubject: subject.id_subject,
      name: subject.name,
      description: subject.description,
    };
    res.status(201).json({ message: "Subject created successfully", subject: formattedSubject });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteSubjectById = async (req, res) => {
  const { idSubject } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const subject = await Subject.findByPk(idSubject, {
      include: [{ model: SubjectTextbook }]
    });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (subject.SubjectTextbook && subject.SubjectTextbook.length > 0) {
      return res.status(400).json({ message: "Cannot delete subject with associated textbooks" });
    }

    await subject.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSubjectById = async (req, res) => {
  const { idSubject } = req.params;
  const { name, description } = req.body;
  const transaction = await sequelize.transaction();
  try {
    if (!name) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    const subject = await Subject.findByPk(idSubject);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject.name = name;
    if (description) {
      subject.description = description;
    }
    await subject.save({ transaction });
    await transaction.commit();

    const formattedSubject = {
      idSubject: subject.id_subject,
      name: subject.name,
      description: subject.description,
    };
    res.status(200).json({ message: "Subject updated successfully", subject: formattedSubject });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error updating subject:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllSubjects,
  createSubject,
  deleteSubjectById,
  updateSubjectById,
};