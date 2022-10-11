const passport = require("passport");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/User");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../config/.env") });

module.exports.postLogin = (req, res, next) => {
  if (!validator.isEmail(req.body.email))
    return res.status(400).json({
      message: "Please enter a valid email address.",
    });
  if (validator.isEmpty(req.body.password))
    return res.json({
      message: "Password cannot be blank.",
    });

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: !user ? "User not found, please sign up" : err,
        user: user,
      });
    }

    req.logIn(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res, next);
};

module.exports.postSignup = async (req, res, next) => {
  if (!req.body.email || !validator.isEmail(req.body.email))
    return res.status(400).json({
      message: "Please enter a valid email address.",
    });

  if (!req.body.password || !validator.isLength(req.body.password, { min: 8 }))
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    });

  if (!req.body.name || !validator.isLength(req.body.name, { min: 1 }))
    return res.status(400).json({
      message: "Please provide a name.",
    });

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser)
    return res.status(409).json({
      message: "Account with that email address already exist.",
    });

  const user = await User.create(req.body);

  return res.status(201).json(user);
};

module.exports.logout = (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: "User has successfully logged out." });
  });
};
