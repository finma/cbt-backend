const fs = require("fs");
const path = require("path");
const { mongoose } = require("mongoose");

const Quiz = require("../quiz/model");
const config = require("../../config");

const actionCreate = async (req, res) => {
  try {
    if (req.user.role !== "public") {
      const { quizId, question, questionType, options, time } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = `${req.file.filename}.${originalExt}`;
        let target_path = path.resolve(
          config.ROOT_PATH,
          `public/uploads/quiz/questions/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            await Quiz.findOneAndUpdate(
              { _id: quizId },
              {
                $push: {
                  questions: {
                    question,
                    time,
                    options,
                    questionType,
                    image: filename,
                  },
                },
              }
            );

            res.status(201).json({
              error: false,
              message: "create new question success!",
            });
          } catch (error) {
            res.status(500).json({
              error: true,
              message: error.message || "Internal server error",
            });
          }
        });
      } else {
        await Quiz.findOneAndUpdate(
          { _id: quizId },
          {
            $push: {
              questions: {
                question,
                time,
                options,
                questionType,
              },
            },
          }
        );

        res.status(201).json({
          error: false,
          message: "create new question success!",
        });
      }
    } else {
      res.status(401).json({
        error: true,
        message: "public can't access this resource",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

const actionUpdate = async (req, res) => {
  try {
    if (req.user.role !== "public") {
      const { id } = req.params;
      const { quizId, question, questionType, options, time } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = `${req.file.filename}.${originalExt}`;
        let target_path = path.resolve(
          config.ROOT_PATH,
          `public/uploads/quiz/questions/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const quiz = await Quiz.aggregate([
              { $match: { _id: mongoose.Types.ObjectId(quizId) } },
              { $unwind: "$questions" },
              { $match: { "questions._id": mongoose.Types.ObjectId(id) } },
              { $project: { image: "$questions.image" } },
            ]);

            let currentImage = `${config.ROOT_PATH}/public/uploads/quiz/questions/${quiz[0].image}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Quiz.findOneAndUpdate(
              {
                "questions._id": mongoose.Types.ObjectId(id),
              },
              {
                $set: {
                  "questions.$.question": question,
                  "questions.$.questionType": questionType,
                  "questions.$.options": options,
                  "questions.$.time": time,
                  "questions.$.image": filename,
                },
              }
            );

            res.status(201).json({
              error: false,
              message: "update soal success!",
            });
          } catch (error) {
            res.status(500).json({
              error: true,
              message: error.message || "Internal server error",
            });
          }
        });
      } else {
        await Quiz.findOneAndUpdate(
          {
            "questions._id": mongoose.Types.ObjectId(id),
          },
          {
            $set: {
              "questions.$.question": question,
              "questions.$.questionType": questionType,
              "questions.$.options": options,
              "questions.$.time": time,
            },
          }
        );

        res.status(201).json({
          error: false,
          message: "update soal success!",
        });
      }
    } else {
      res.status(401).json({
        error: true,
        message: "public can't access this resource",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

const actionDelete = async (req, res) => {
  try {
    if (req.user.role !== "public") {
      const { id } = req.params;
      const { quizId } = req.body;

      const quiz = await Quiz.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(quizId) } },
        { $unwind: "$questions" },
        { $match: { "questions._id": mongoose.Types.ObjectId(id) } },
        { $project: { image: "$questions.image" } },
      ]);

      let currentImage = `${config.ROOT_PATH}/public/uploads/quiz/questions/${quiz[0].image}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      await Quiz.findOneAndUpdate(
        { _id: quizId },
        {
          $pull: {
            questions: {
              _id: id,
            },
          },
        }
      );

      res.status(200).json({
        error: false,
        message: "delete question success!",
      });
    } else {
      res.status(401).json({
        error: true,
        message: "public can't access this resource",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

module.exports = {
  actionCreate,
  actionUpdate,
  actionDelete,
};
