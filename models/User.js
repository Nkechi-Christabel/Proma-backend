const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      // lowercase: true,
      match: [/[0-9A-Za-z\s]+/, "is invalid"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: [8, "Minimum password length is 8 characters"],
      required: [true, "Please enter a password"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//removes the prefix from _id and delete '_v'
UserSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.password;
    delete returnedObj.__v;
  },
});

// Password hash middleware.
UserSchema.pre("save", function save(next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next();
  }
  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    //If error, return
    if (err) {
      return next(err);
    }
    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      //If error, return
      if (err) {
        return next(err);
      }
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// Helper method for verifying user's password.
UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
