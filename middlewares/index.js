const { authenticate } = require("./authMiddleware");
const corsMiddleware = require("./cors");

module.exports = {
  authenticate,
  corsMiddleware,
}; 