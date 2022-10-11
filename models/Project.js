const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      require: true,
    },
    cloudinaryId: {
      type: String,
      require: true,
    },
    website: String,
    gitRepo: String,
    desc: String,
    status: {
      isInitiating: Boolean,
      isExecuting: Boolean,
      isComplete: Boolean,
      isHosted: Boolean,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//removes the prefix from _id and delete '_v'
ProjectSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Project", ProjectSchema);
