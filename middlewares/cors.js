function cors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Разрешить доступ всем
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, bypass-tunnel-reminder"
  );

  // Если это preflight-запрос, завершите его здесь
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
}

module.exports = cors;
