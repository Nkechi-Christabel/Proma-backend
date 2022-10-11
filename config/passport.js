const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "./config/.env") });

//JWT Cookie Combo Passport Strategy
// const JwtCookieComboStrategy = require("passport-jwt-cookiecombo");
// const config = require("./passportConfig");

const User = require("../models/User");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: `Email ${email} not found.` });
      }
      if (!user.password) {
        return done(null, false, {
          message: "Incorrect password",
        });
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { msg: "Invalid email or password." });
      });
    });
  })
);

// const cookieExtractor = (req) => {
//   let token = null;
//   console.log(token);
//   if (req && req.cookies) {
//     token = req.cookies["access_token"];
//   }
//   return token;
// }

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
// opts.audience = "http://localhost:8000/";
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.id }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, (err, user) => done(err, user));
// });
