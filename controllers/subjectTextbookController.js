const { SubjectTextbook, Subject, sequelize } = require("../models");
const { Op } = require("sequelize");
const { formatISBN } = require("../utils/formatISBN");

const getTextbooksBySubject = async (req, res) => {
  const { idSubject } = req.params;
  try {
    const textbooks = await SubjectTextbook.findAll({
      where: { id_subject: idSubject },
      attributes: [
        "id_subject_textbook",
        "name",
        "year",
        "authors",
        "isbn",
        "file_link",
      ],
      include: {
        model: Subject,
        attributes: ["id_subject", "name"],
      },
    });

    const formattedTextbooks = textbooks.map((textbook) => ({
      idSubjectTextbook: textbook.id_subject_textbook,
      name: textbook.name,
      year: textbook.year,
      authors: textbook.authors,
      isbn: textbook.isbn,
      fileLink: textbook.file_link,
      subject: {
        idSubject: textbook.Subject.id_subject,
        name: textbook.Subject.name,
      },
    }));

    res.status(200).json({
      message: "Textbooks fetched successfully",
      textbooks: formattedTextbooks,
    });
  } catch (error) {
    console.error("Error fetching textbooks by subject:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllTextbooks = async (req, res) => {
  try {
    const textbooks = await SubjectTextbook.findAll({
      attributes: [
        "id_subject_textbook",
        "name",
        "year",
        "authors",
        "isbn",
        "file_link",
      ],
      include: {
        model: Subject,
        attributes: ["id_subject", "name"],
      },
    });

    const formattedTextbooks = textbooks.map((textbook) => ({
      idSubjectTextbook: textbook.id_subject_textbook,
      name: textbook.name,
      year: textbook.year,
      authors: textbook.authors,
      isbn: textbook.isbn,
      fileLink: textbook.file_link,
      subject: {
        idSubject: textbook.Subject.id_subject,
        name: textbook.Subject.name,
      },
    }));

    res.status(200).json({
      message: "All textbooks fetched successfully",
      textbooks: formattedTextbooks,
    });
  } catch (error) {
    console.error("Error fetching all textbooks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTextbookById = async (req, res) => {
  const { idTextbook } = req.params;
  try {
    const textbook = await SubjectTextbook.findByPk(idTextbook, {
      attributes: [
        "id_subject_textbook",
        "name",
        "year",
        "authors",
        "isbn",
        "file_link",
      ],
      include: {
        model: Subject,
        attributes: ["id_subject", "name"],
      },
    });

    if (!textbook) {
      return res.status(404).json({ message: "Textbook not found" });
    }

    const formattedTextbook = {
      idSubjectTextbook: textbook.id_subject_textbook,
      name: textbook.name,
      year: textbook.year,
      authors: textbook.authors,
      isbn: textbook.isbn,
      fileLink: textbook.file_link,
      subject: {
        idSubject: textbook.Subject.id_subject,
        name: textbook.Subject.name,
      },
    };

    res
      .status(200)
      .json({
        message: "Textbook fetched successfully",
        textbook: formattedTextbook,
      });
  } catch (error) {
    console.error("Error fetching textbook by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTextbooksByName = async (req, res) => {
  const { name } = req.params;
  try {
    const textbooks = await SubjectTextbook.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      attributes: [
        "id_subject_textbook",
        "name",
        "year",
        "authors",
        "isbn",
        "file_link",
      ],
      include: {
        model: Subject,
        attributes: ["id_subject", "name"],
      },
    });

    const formattedTextbooks = textbooks.map((textbook) => ({
      idSubjectTextbook: textbook.id_subject_textbook,
      name: textbook.name,
      year: textbook.year,
      authors: textbook.authors,
      isbn: textbook.isbn,
      fileLink: textbook.file_link,
      subject: {
        idSubject: textbook.Subject.id_subject,
        name: textbook.Subject.name,
      },
    }));

    res.status(200).json({
      message: "Textbooks fetched successfully",
      textbooks: formattedTextbooks,
    });
  } catch (error) {
    console.error("Error fetching textbooks by name:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createTextbook = async (req, res) => {
  const transaction = await sequelize.transaction();
  const { idSubject, name, year, authors, isbn, fileLink } = req.body;
  try {
    if (!idSubject || !name || !year || !authors) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const textbook = await SubjectTextbook.create(
      { id_subject: idSubject, name, year, authors, isbn, file_link: fileLink },
      { transaction }
    );
    await transaction.commit();

    const formattedTextbook = {
      idSubjectTextbook: textbook.id_subject_textbook,
      name: textbook.name,
      year: textbook.year,
      authors: textbook.authors,
      isbn: textbook.isbn,
      fileLink: textbook.file_link,
      subject: {
        idSubject: idSubject,
        name: (await Subject.findByPk(idSubject)).name,
      },
    };
    res
      .status(201)
      .json({
        message: "Textbook created successfully",
        textbook: formattedTextbook,
      });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error creating textbook:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTextbookById = async (req, res) => {
  const { idTextbook } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const textbook = await SubjectTextbook.findByPk(idTextbook);
    if (!textbook) {
      return res.status(404).json({ message: "Textbook not found" });
    }

    await textbook.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Textbook deleted successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error deleting textbook:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTextbookById = async (req, res) => {
  const { idTextbook } = req.params;
  const { idSubject, name, year, authors, isbn, fileLink } = req.body;
  const transaction = await sequelize.transaction();
  try {
    if (!idSubject || !name || !year || !authors) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const textbook = await SubjectTextbook.findByPk(idTextbook);
    if (!textbook) {
      return res.status(404).json({ message: "Textbook not found" });
    }

    textbook.id_subject = idSubject;
    textbook.name = name;
    textbook.year = year;
    textbook.authors = authors;
    textbook.isbn = isbn;
    textbook.file_link = fileLink;
    await textbook.save({ transaction });
    await transaction.commit();

    const formattedTextbook = {
      idSubjectTextbook: textbook.id_subject_textbook,
      name: textbook.name,
      year: textbook.year,
      authors: textbook.authors,
      isbn: textbook.isbn,
      fileLink: textbook.file_link,
      subject: {
        idSubject: idSubject,
        name: (await Subject.findByPk(idSubject)).name,
      },
    };
    res
      .status(200)
      .json({
        message: "Textbook updated successfully",
        textbook: formattedTextbook,
      });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error updating textbook:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTextbooksByISBN = async (req, res) => {
  const { isbn } = req.params;
  try {
    const formattedISBN = formatISBN(isbn);
    const textbooks = await SubjectTextbook.findAll({
      where: {
        isbn: {
          [Op.iLike]: `%${formattedISBN}%`,
        },
      },
      attributes: [
        "id_subject_textbook",
        "name",
        "year",
        "authors",
        "isbn",
        "file_link",
      ],
      include: {
        model: Subject,
        attributes: ["id_subject", "name"],
      },
    });

    const formattedTextbooks = textbooks.map((textbook) => ({
      idSubjectTextbook: textbook.id_subject_textbook,
      name: textbook.name,
      year: textbook.year,
      authors: textbook.authors,
      isbn: textbook.isbn,
      fileLink: textbook.file_link,
      subject: {
        idSubject: textbook.Subject.id_subject,
        name: textbook.Subject.name,
      },
    }));

    res.status(200).json({
      message: "Textbooks fetched successfully",
      textbooks: formattedTextbooks,
    });
  } catch (error) {
    console.error("Error fetching textbooks by ISBN:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTextbooksBySubject,
  getAllTextbooks,
  getTextbookById,
  getTextbooksByName,
  createTextbook,
  deleteTextbookById,
  updateTextbookById,
  getTextbooksByISBN
};
