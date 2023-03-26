const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/").get(userController.getUsers);

router.route("/:id").patch(authController.protect, userController.followUser);

router.route("/:username").get(userController.getUserByUsername);

module.exports = router;
