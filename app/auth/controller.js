const { OAuth2Client } = require("google-auth-library");

const User = require("../user/model");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = new User({
      name,
      email,
      username: name.split(" ")[0].toLowerCase(),
    });

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      config.JWT_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      error: false,
      message: "signup success!",
      data: { user, token },
    });
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.status(422).json({
        error: true,
        message: error.message,
        fields: error.errors,
      });
    }
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, username } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
        },
        config.JWT_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).json({
        error: false,
        message: "signin success!",
        data: { user, token },
      });
    } else {
      res
        .status(403)
        .json({ error: true, message: "data yang anda masukan salah." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });

    next();
  }
};

const googleauth = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const { payload } = await client.verifyIdToken({
      idToken: tokenId,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const user = await User.findOne({ email: payload.email });

    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
        },
        config.JWT_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).json({
        error: false,
        message: "signin with google success!",
        data: { user, token },
        type: "signin",
      });
    } else {
      const newUser = new User({
        email: payload.email,
        name: payload.name,
        username: payload.given_name.toLowerCase(),
      });

      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          username: newUser.username,
          role: newUser.role,
        },
        config.JWT_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).json({
        error: false,
        message: "signup with google success!",
        data: { user: newUser, token },
        type: "signup",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const setrole = async (req, res) => {
  try {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, {
      role: req.body.role,
    });

    const newUserRole = await User.findById(_id);

    const token = jwt.sign(
      {
        id: newUserRole._id,
        email: newUserRole.email,
        name: newUserRole.name,
        username: newUserRole.username,
        role: newUserRole.role,
      },
      config.JWT_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({
      error: false,
      message: "set new role success!",
      data: { user: newUserRole, token },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = { signup, signin, googleauth, setrole };
