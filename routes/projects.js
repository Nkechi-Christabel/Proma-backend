const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const projectsController = require("../controllers/projects");
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  projectsController.createProject
);
router.get(
  "/userProjects",
  passport.authenticate("jwt", { session: false }),
  projectsController.userProjects
);

router.get("/allProjects", projectsController.allProjects);
router.get("/:id", projectsController.singleProject);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  projectsController.deleteProject
);
router.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  projectsController.updateProject
);

module.exports = router;
