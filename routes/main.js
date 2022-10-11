const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth");
require("../config/passport");

router.post("/logout", authController.logout);
router.post("/login", authController.postLogin);
// router.get(
//   "/user",
//   passport.authenticate("jwt", { session: false }),
//   authController.getUser
// );
router.post("/signup", authController.postSignup);

module.exports = router;
