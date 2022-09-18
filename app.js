const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const authRouter = require("./app/auth/router");
const userRouter = require("./app/user/router");
const beritaRouter = require("./app/berita/router");
const kategoriRouter = require("./app/kategori/router");
const soalRouter = require("./app/soal/router");
const quizRouter = require("./app/quiz/router");
const reportRouter = require("./app/report/router");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/berita", beritaRouter);
app.use("/api/kategori", kategoriRouter);
app.use("/api/soal", soalRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/report", reportRouter);

app.use("/", (req, res) => {
  res.render("index", { title: "test" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
