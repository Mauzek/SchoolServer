const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Создаем директории для загрузки, если они не существуют
const uploadDir = path.join(__dirname, "../uploads");
const userPhotosDir = path.join(uploadDir, "userPhotos");
const answersDir = path.join(uploadDir, "answers"); // Директория для ответов

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(userPhotosDir)) {
  fs.mkdirSync(userPhotosDir);
}

if (!fs.existsSync(answersDir)) {
  fs.mkdirSync(answersDir);
}

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Определяем директорию в зависимости от типа файла
    if (req.route.path.includes("assignment") || req.route.path.includes("testing")) {
      cb(null, answersDir); // Для ответов
    } else {
      cb(null, userPhotosDir); // Для фото пользователей
    }
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  },
});

// Фильтр файлов для проверки типа
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Недопустимый формат файла. Разрешены только изображения (jpeg, jpg, png, gif) и PDF"
      ),
      false
    );
  }
};

// Создаем middleware для загрузки
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload,
  userPhotosDir,
  answersDir,
};