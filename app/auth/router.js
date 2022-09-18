const express = require("express");
const multer = require("multer");
const os = require("os");

const router = express.Router();
const { signup, signin, googleauth, setrole } = require("./controller");
const { isLoginUser } = require("../middleware/auth");

router.post("/signup", multer({ dest: os.tmpdir() }).single("image"), signup);
router.post("/signin", signin);
router.post("/googleauth", googleauth);
router.post("/setrole", isLoginUser, setrole);

module.exports = router;
