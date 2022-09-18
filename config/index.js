const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

module.exports = {
  SERVICE_NAME: process.env.SERVICE_NAME,
  MONGO_URL: process.env.MONGO_URL,
  JWT_KEY: process.env.SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  ROOT_PATH: path.resolve(__dirname, ".."),
};
