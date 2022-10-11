// const dotenv = require("dotenv");
// require("dotenv").config();
const mongoose = require("mongoose");
// const path = require("path");
// require("dotenv").config({ path: "./env" });

// // dotenv.config({ path: path.join(__dirname + "./env") });
// console.log(process.env.DB_STRING);

mongoose.connect(process.env.DB_STRING);

mongoose.connection.on("connected", () => console.log("Mongoose connected"));
mongoose.connection.on("error", (err) => console.log(err));

mongoose.connection.on("disconnected", () =>
  console.log("Mongoose disconnected")
);

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

module.exports = mongoose;
