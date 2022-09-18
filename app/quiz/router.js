const express = require("express");
const multer = require("multer");
const os = require("os");

const router = express.Router();
const {
  getAllQuiz,
  getOneQuiz,
  actionCreate,
  actionUpdate,
  actionDelete,
} = require("./controller");
const { isLoginUser } = require("../middleware/auth");

router.get("/", isLoginUser, getAllQuiz);
router.get("/:id", isLoginUser, getOneQuiz);
router.post(
  "/create",
  multer({ dest: os.tmpdir() }).single("image"),
  isLoginUser,
  actionCreate
);
router.put(
  "/update/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  isLoginUser,
  actionUpdate
);
router.delete("/delete/:id", isLoginUser, actionDelete);

module.exports = router;
