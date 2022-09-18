const mongoose = require("mongoose");

const kategoriSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kategori", kategoriSchema);
