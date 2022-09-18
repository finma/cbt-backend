const { default: mongoose } = require("mongoose");
const { uid } = require("uid");

const Report = require("./model");

const getAllReport = async (req, res) => {
  try {
    if (req.user.role !== "public") {
      const reports = await Report.find({ userId: req.user._id }).populate({
        path: "quizId",
      });

      res.status(200).json({
        error: false,
        message: "success",
        data: reports,
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

const getOneReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (id.length > 6) {
      const reports = await Report.findOne({ _id: id }).populate({
        path: "quizId",
      });

      res.status(200).json({
        error: false,
        message: "success",
        data: reports,
      });
    } else {
      const reports = await Report.findOne({ code: id }).populate({
        path: "quizId",
      });

      res.status(200).json({
        error: false,
        message: "success",
        data: reports,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

// const actionCreate = async (data, client) => {
//   try {
//     console.log("data", data);
//     const { userId, quizId, code } = data;
//     const newReport = new Report({ userId, quizId, code: uid(6) });

//     // await client.join(code);
//     await newReport.save();

//     global.io.sockets.to(code).emit("room-created", newReport);

//     return { error: false, message: "success create room", data: newReport };
//   } catch (error) {
//     return { error: true, message: error.message || "Internal server error" };
//   }
// };

const actionCreate = async (req, res) => {
  try {
    if (req.user.role !== "public") {
      const { quizId, userId } = req.body;
      const code = uid(6);

      const newReport = new Report({ quizId, userId, code });

      await newReport.save();

      await Report.findOneAndUpdate(
        { _id: newReport._id },
        {
          code: String(newReport._id).substring(
            String(newReport._id).length - 6
          ),
        }
      );

      const report = await Report.findOne({ _id: newReport._id });

      res.status(201).json({
        error: false,
        message: "success create room",
        data: report,
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

const actionDelete = async (req, res) => {
  try {
    if (req.user.role !== "public") {
      const { id } = req.params;

      await Report.findOneAndRemove({ _id: id });

      res.status(201).json({
        error: false,
        message: "delete report success!",
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

const userJoin = async (data) => {
  try {
    const { reportId, code, student } = data;

    await Report.findOneAndUpdate(
      { code: code },
      {
        $push: {
          students: student,
        },
      }
    );

    const reportUpdated = await Report.aggregate([
      {
        $match: { code: code },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "dataQuestion",
        },
      },
    ]);

    return {
      error: false,
      message: "success",
      data: reportUpdated[0],
      student: reportUpdated[0].students.at(-1),
    };
  } catch (error) {
    return { error: true, message: error.message || "Internal server error" };
  }
};

const statusQuiz = async (data) => {
  try {
    const { reportId, isStart } = data;

    await Report.findOneAndUpdate({ _id: reportId }, { isStart });

    const reportUpdated = await Report.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(reportId) },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "dataQuestion",
        },
      },
    ]);

    return { error: false, message: "success", data: reportUpdated[0] };
  } catch (error) {
    return { error: true, message: error.message || "Internal server error" };
  }
};

const userAnswer = async (data) => {
  try {
    const { reportId, student } = data;

    await Report.findOneAndUpdate(
      { "students._id": mongoose.Types.ObjectId(student._id) },
      {
        $set: {
          "students.$.correct": student.correct,
          "students.$.incorrect": student.incorrect,
          "students.$.point": student.point,
        },
      }
    );

    const reportUpdated = await Report.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(reportId) },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "dataQuestion",
        },
      },
    ]);

    return { error: false, message: "success", data: reportUpdated[0] };
  } catch (error) {
    return { error: true, message: error.message || "Internal server error" };
  }
};

const getLiveReport = async ({ reportId, roomId }) => {
  // const report = await Report.findOne({ _id: reportId });

  const report = await Report.aggregate([
    {
      $match: { code: roomId },
    },
    {
      $lookup: {
        from: "quizzes",
        localField: "quizId",
        foreignField: "_id",
        as: "dataQuestion",
      },
    },
  ]);

  console.log("report", report);

  // global.io.sockets.to(roomId).emit("get-report", report);
  return { error: false, message: "success", data: report[0] };
};

// global.io.on("get-data-report", async ({ reportId, roomId }) => {

// });

module.exports = {
  getAllReport,
  getOneReport,
  getLiveReport,
  actionCreate,
  actionDelete,
  userJoin,
  statusQuiz,
  userAnswer,
};
