require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const logger = require("morgan");
const app = express();
const cors = require("cors");
const mainRoutes = require("./routes/main");
const projectRoutes = require("./routes/projects");
// const dotenv = require("dotenv");
// const path = require("path");
// dotenv.config({ path: path.join(__dirname, "./config/.env") });
require("./config/database");
require("./config/passport");
const PORT = process.env.PORT || 8002;

//Cross-browser-origin
const corsOptions = {
  origin: process.env.SITE_ORIGIN || process.env.LOCAL || process.env.PORT,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//Logging in the console
app.use(logger("dev"));

//Static Folder
app.use(express.static("public"));

//Pass a secret to sign the secured http cookie
app.use(cookieParser());

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Passport middleware
app.use(passport.initialize());
// app.use(passport.session());

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------
//Routes
app.get("/healthcheck", (_, res) =>
  res.status(200).json({ success: true, message: "Server up" })
);

app.use("/", mainRoutes);
app.use("/projects", projectRoutes);

//Server Running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, you better catch it!`);
});
