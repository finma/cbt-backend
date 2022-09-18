const express = require("express");
const multer = require("multer");
const os = require("os");

const router = express.Router();
const {
  getAllBerita,
  getOneBerita,
  actionCreate,
  actionUpdate,
  actionDelete,
  changeStatus,
} = require("./controller");
const { isLoginUser } = require("../middleware/auth");

router.get("/", getAllBerita);
router.get("/:id", getOneBerita);
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
router.put("/status/:id", isLoginUser, changeStatus);

module.exports = router;
