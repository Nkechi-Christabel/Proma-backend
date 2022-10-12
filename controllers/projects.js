const cloudinary = require("../middleware/cloudinary");
const Project = require("../models/Project");

//Create a new project
module.exports.createProject = async (req, res) => {
  try {
    // Upload image to cloudinary
    const upload = await cloudinary.uploader.upload(req.file.path);

    const { body } = req;

    const data = await Project.create({
      ...body,
      image: upload.secure_url,
      cloudinaryId: upload.public_id,
      user: req.user._id,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//get user's posted project/projects
module.exports.userProjects = async (req, res) => {
  try {
    const data = await Project.find({ user: req.user._id })
      .sort({ createdAt: "asc" })
      .lean();
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "User's Projects not found" });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Gets a single project by id
module.exports.singleProject = async (req, res) => {
  try {
    const data = await Project.findOne({
      _id: req.params.id,
      // user: req.user._id,
    })
      .lean()
      .populate("user");
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteProject = async (req, res) => {
  try {
    // Find post by id
    let project = await Project.findById({
      _id: req.params.id,
      user: req.user._id,
    });
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(project.cloudinaryId);
    // Delete project from db
    const result = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    res
      .status(200)
      .json({ message: `User ${result.user.name} has been deleted` });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error deleting project with id ${req.params.id}` });
  }
};

module.exports.updateProject = async (req, res) => {
  try {
    // Find post by id
    let project = await Project.findById({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) {
      res.status(404).json({ message: "Project not found" });
    }

    //
    //Delete the prev image
    await cloudinary.uploader.destroy(project.cloudinaryId);
    //Upload the new one
    const upload = await cloudinary.uploader.upload(req.file.path);

    const { body } = req;
    const data = {
      ...body,
      image: upload.secure_url,
      cloudinaryId: upload.public_id,
    };

    project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      data,
      {
        new: true,
      }
    );

    console.log(project);
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({
      message: `Error retrieving and updating project with id ${req.params.id}`,
    });
  }
};

module.exports.allProjects = async (req, res) => {
  try {
    const data = await Project.find().sort({ createdAt: "asc" }).lean();
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Projects not found" });
    // console.log("One date", data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
