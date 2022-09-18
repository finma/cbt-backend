const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    code: {
      type: String,
      default: "",
    },
    isStart: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      require: true,
    },
    students: [
      {
        name: {
          type: String,
          require: true,
        },
        correct: {
          type: Number,
          default: 0,
        },
        incorrect: {
          type: Number,
          default: 0,
        },
        point: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
