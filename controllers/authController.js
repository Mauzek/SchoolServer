const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Регистрация пользователя
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка, существует ли уже такой пользователь
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь с таким логином уже существует" });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // Генерация токена JWT
    console.log('JWT_SECRET:', process.env.JWT_SECRET);  // Логируем секретный ключ
    const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Токен будет действителен 1 час
    });

    // Генерация refresh токена
    const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_REFRESH_SECRET, // Это будет другой секрет для рефреш токена
        { expiresIn: "7d" } // Срок жизни refresh token — 7 дней
      );

    res.status(201).json({ message: "Пользователь успешно зарегистрирован", accessToken, refreshToken });
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);  // Логируем ошибку
    res.status(500).json({ message: "Ошибка сервера", error: error.message });  // Добавляем подробности ошибки
  }
};

// Логин пользователя
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Поиск пользователя по логину
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Сравнение пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    // Генерация токена JWT
    const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Генерация refresh токена
    const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_REFRESH_SECRET, // Это будет другой секрет для рефреш токена
        { expiresIn: "7d" } // Срок жизни refresh token — 7 дней
      );
    

    res.json({ message: "Успешный вход", accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token отсутствует.' });
    }
  
    // Проверяем рефреш-токен
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Refresh token недействителен.' });
      }
  
      // Если refresh токен валиден, создаем новый access token
      const newAccessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Отправляем новый access token клиенту
      res.cookie('jwt', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.json({ accessToken: newAccessToken });
    });
  };

module.exports = { register, login, refreshAccessToken };
