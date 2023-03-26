const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    user: user,
  });
});

exports.getUserByUsername = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });

  res.status(200).json({
    status: "success",
    user: user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    user: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ status: "success" });
});

exports.followUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    $addToSet: { followers: req.body.follower },
  });

  const follower = await User.findOneAndUpdate(
    { username: req.body.follower.username },
    {
      $addToSet: {
        following: {
          username: user.username,
          _id: user._id,
          profilePic: user.profilePic,
        },
      },
    }
  );

  res.status(200).json({
    user: user,
    follower: follower,
  });
});

//exports.getFollowers = catchAsync(async (req, res, next) => {});

//Maybe list items by date/time created *
//exports.showFeed
