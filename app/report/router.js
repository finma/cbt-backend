const express = require("express");
const router = express.Router();

const {
  getOneReport,
  getAllReport,
  actionCreate,
  actionDelete,
} = require("./controller");
const { isLoginUser } = require("../middleware/auth");

router.get("/", isLoginUser, getAllReport);
router.get("/:id", isLoginUser, getOneReport);
router.post("/create", isLoginUser, actionCreate);
router.delete("/delete/:id", isLoginUser, actionDelete);

module.exports = router;
