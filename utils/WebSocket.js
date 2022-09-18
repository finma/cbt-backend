const {
  getLiveReport,
  actionCreate,
  userJoin,
  statusQuiz,
  userAnswer,
} = require("../app/report/controller");

class WebSockets {
  connection(client) {
    // * admin/dosen create room + report
    client.on("create-room", async ({ code }) => {
      client.join(code);

      // console.log("room id : ", code);
    });

    client.on("get-data-report", async ({ reportId, roomId }) => {
      // console.log("get data", { reportId, roomId });
      const report = await getLiveReport({ reportId, roomId });

      client.to(roomId).emit("get-report", report);
    });

    // * handle user join with room code
    client.on("user-join", async (data) => {
      client.join(data.code);

      const result = await userJoin(data);

      client.to(data.code).emit("get-report", result);
    });

    // * handle update status quiz
    client.on("update-status", async (data) => {
      const result = await statusQuiz(data);

      client.to(result.data.code).emit("get-report", result);
    });

    // * handle user answering question
    client.on("user-answering", async (data) => {
      const result = await userAnswer(data);

      // console.log("result", result);

      client.to(result.data.code).emit("get-report", result);
    });

    // ! TEST WEB SOCKET
    client.on("join", (data) => {
      client.join(data);
      // console.log("data", data);
    });
  }
}

module.exports = WebSockets;
