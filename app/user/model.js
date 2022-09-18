const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const HASH_ROUND = 10;

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
      maxlength: 255,
      minlength: 2,
    },
    username: {
      type: String,
      require: true,
      maxlength: 255,
      minlength: 2,
    },
    role: {
      type: String,
      enum: ["admin", "dosen", "mahasiswa", "cama", "public"],
      default: "public",
    },
  },
  { timestamps: true }
);

userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").countDocuments({ email: value });
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

module.exports = mongoose.model("User", userSchema);
