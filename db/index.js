const mongoose = require("mongoose");
const { MONGO_URL } = require("../config");

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

module.exports = db;
