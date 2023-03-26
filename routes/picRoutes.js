const express = require("express");
const picController = require("./../controllers/picController");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(picController.getAllPics)
  .post(authController.protect, picController.createPic);

router
  .route("/:id")
  .get(picController.getPic)
  .patch(picController.commentPic)
  .delete(picController.deletePic);

module.exports = router;
