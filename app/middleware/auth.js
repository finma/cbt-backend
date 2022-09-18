const config = require("../../config");
const jwt = require("jsonwebtoken");
const User = require("../user/model");

const isLoginUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.replace("Bearer ", "")
      : null;

    const data = jwt.verify(token, config.JWT_KEY);

    const user = await User.findOne({ _id: data.id });

    if (!user) throw new Error();

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({
      error: true,
      message: error.message || "Not authorized to acces this resource",
    });
  }
};

module.exports = { isLoginUser };
