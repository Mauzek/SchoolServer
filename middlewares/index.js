const { authenticate } = require("./authMiddleware");
const corsMiddleware = require("./cors");
const  {upload} = require("./fileUpload");

module.exports = {
  authenticate,
  corsMiddleware,
  upload,
}; 