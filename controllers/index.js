const {login, refreshAccessToken, register} = require("./authController");

module.exports = {
  register,
  login,
  refreshAccessToken,
};