const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Создаем директорию для загрузки, если она не существует
const uploadDir = path.join(__dirname, "../uploads");
const userPhotosDir = path.join(uploadDir, "userPhotos");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(userPhotosDir)) {
  fs.mkdirSync(userPhotosDir);
}

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userPhotosDir);
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  },
});

// Фильтр файлов для проверки типа
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Недопустимый формат файла. Разрешены только изображения (jpeg, jpg, png, gif)"
      ),
      false
    );
  }
};

// Создаем middleware для загрузки
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload,
  userPhotosDir,
};
