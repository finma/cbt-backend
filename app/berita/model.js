const mongoose = require("mongoose");

const beritaSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      require: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Berita", beritaSchema);
