const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "Токен не предоставлен" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Сохраняем информацию о пользователе в запросе
    next();
  } catch (error) {
    return res.status(401).json({ message: "Неверный или истёкший токен" });
  }
};

module.exports = authenticate;
