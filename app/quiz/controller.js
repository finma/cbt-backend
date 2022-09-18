const fs = require("fs");
const path = require("path");

const Quiz = require("./model");
const config = require("../../config");

const getAllQuiz = async (req, res) => {
  try {
    const { title, category } = req.query;

    let criteria = {
      userId: req.user._id,
    };

    if (title) {
      criteria = {
        ...criteria,
        title: {
          $regex: `${title}`,
          $options: "i",
        },
      };
    }

    if (category) {
      criteria = {
        ...criteria,
        category: {
          $regex: `${category}`,
          $options: "i",
        },
      };
    }

    const quiz = await Quiz.aggregate([
      {
        $match: criteria,
      },
    ]);

    res.status(200).json({
      error: false,
      message: "get all quiz success!",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message || "Internal server error",
    });
  }
};

const getOneQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOne({ _id: id });

    if (!quiz) {
      res.status(404).json({
        error: true,
        message: "quiz not found!",
      });
    } else {
      res.status(200).json({
        error: false,
        message: "get quiz success!",
        data: quiz,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message || "Internal server error",
    });
  }
};

const actionCreate = async (req, res) => {
  try {
    if (req.user.role !== "public") {
      const { title, status, isPublish, category } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = `${req.file.filename}.${originalExt}`;
        let target_path = path.resolve(
          config.ROOT_PATH,
          `public/uploads/quiz/thumbnail/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const newQuiz = new Quiz({
              title,
              status,
              isPublish,
              category,
              userId: req.user._id,
              image: filename,
            });

            await newQuiz.save();

            res.status(201).json({
              error: false,
              message: "create new quiz success!",
              data: newQuiz,
            });
          } catch (error) {
            res.status(500).json({
              error: true,
              message: error.message || "Internal server error",
            });
          }
        });
      } else {
        const newQuiz = new Quiz({
          title,
          status,
          isPublish,
          category,
          userId: req.user._id,
        });

        await newQuiz.save();

        res.status(201).json({
          error: false,
          message: "create new quiz success!",
          data: newQuiz,
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
      const { title, status, isPublish, category } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = `${req.file.filename}.${originalExt}`;
        let target_path = path.resolve(
          config.ROOT_PATH,
          `public/uploads/quiz/thumbnail/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const quiz = await Quiz.findOne({ _id: id });

            let currentImage = `${config.ROOT_PATH}/public/uploads/quiz/thumbnail/${quiz.image}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Quiz.findOneAndUpdate(
              { _id: id },
              {
                title,
                status,
                isPublish,
                category,
                image: filename,
              }
            );

            res.status(201).json({
              error: false,
              message: "update quiz success!",
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
          { _id: id },
          {
            title,
            status,
            isPublish,
            category,
          }
        );

        res.status(201).json({
          error: false,
          message: "update quiz success!",
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

      const quiz = await Quiz.findByIdAndRemove({ _id: id });

      if (quiz.image) {
        let currentImage = `${config.ROOT_PATH}/public/uploads/quiz/thumbnail/${quiz.image}`;

        if (fs.existsSync(currentImage)) {
          fs.unlinkSync(currentImage);
        }
      }

      res.status(200).json({
        error: false,
        message: "delete quiz success!",
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
  getAllQuiz,
  getOneQuiz,
  actionCreate,
  actionUpdate,
  actionDelete,
};
