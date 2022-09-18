const mongoose = require("mongoose");

const quizSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    isPublish: {
      type: String,
      enum: ["draft", "publish"],
      default: "draft",
    },
    image: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      require: true,
    },
    questions: [
      {
        questionId: String,
        question: String,
        options: Array,
        image: String,
        time: Number,
        questionType: Boolean, // false === one correct answer || true === more than correct answer
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
