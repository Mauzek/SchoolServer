const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Создаем директории для загрузки, если они не существуют
const uploadDir = path.join(__dirname, "../uploads");
const userPhotosDir = path.join(uploadDir, "userPhotos");
const assignmentsFilesDir = path.join(uploadDir, 'assignmentsFiles'); // Директория для файлов заданий
const testingFilesDir = path.join(uploadDir, 'testingFiles'); // Директория для файлов тестирования
const answersDir = path.join(uploadDir, "answers"); // Директория для ответов студентов

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(userPhotosDir)) {
  fs.mkdirSync(userPhotosDir);
}

if (!fs.existsSync(assignmentsFilesDir)) {
  fs.mkdirSync(assignmentsFilesDir);
}

if (!fs.existsSync(testingFilesDir)) {
  fs.mkdirSync(testingFilesDir);
}

if (!fs.existsSync(answersDir)) {
  fs.mkdirSync(answersDir);
}

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Определяем директорию в зависимости от имени поля файла
    if (file.fieldname === 'assignmentFile') {
      cb(null, assignmentsFilesDir);
    } else if (file.fieldname === 'testingFile') {
      cb(null, testingFilesDir);
    } else if (file.fieldname === 'file') {
      cb(null, answersDir); // Для ответов студентов
    } else {
      cb(null, userPhotosDir); // По умолчанию для фото пользователей
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
  // Расширенный список разрешенных типов файлов
  const allowedTypes = [
    "image/jpeg", 
    "image/png", 
    "image/jpg", 
    "image/gif", 
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "text/plain", // .txt
    "application/zip", // .zip
    "application/x-rar-compressed" // .rar
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Недопустимый формат файла. Разрешены: изображения (jpeg, jpg, png, gif), PDF, документы Office (doc, docx, xls, xlsx, ppt, pptx), текстовые файлы и архивы (zip, rar)"
      ),
      false
    );
  }
};

// Создаем middleware для загрузки
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // Увеличено до 25МБ
  },
  fileFilter: fileFilter,
});

// Вспомогательная функция для получения относительного пути файла для хранения в базе данных
const getRelativeFilePath = (fileName, fileType) => {
  let directory;
  
  switch(fileType) {
    case 'assignment':
      directory = 'assignmentsFiles';
      break;
    case 'testing':
      directory = 'testingFiles';
      break;
    case 'answer':
      directory = 'answers';
      break;
    default:
      directory = 'userPhotos';
  }
  
  return `/uploads/${directory}/${fileName}`;
};

// Middleware для обработки загрузки файлов заданий
const uploadAssignment = upload.fields([
  { name: 'assignmentFile', maxCount: 1 },
  { name: 'testingFile', maxCount: 1 }
]);

// Middleware для обработки загрузки одного файла задания
const uploadSingleAssignmentFile = upload.single('assignmentFile');

// Middleware для обработки загрузки одного файла тестирования
const uploadSingleTestingFile = upload.single('testingFile');

// Middleware для обработки загрузки файла ответа
const uploadAnswerFile = upload.single('answerFile');

// Middleware для обработки загрузки фото пользователя
const uploadUserPhoto = upload.single('userPhoto');

module.exports = {
  upload,
  uploadAssignment,
  uploadSingleAssignmentFile,
  uploadSingleTestingFile,
  uploadAnswerFile,
  uploadUserPhoto,
  userPhotosDir,
  assignmentsFilesDir,
  testingFilesDir,
  answersDir,
  getRelativeFilePath
};
