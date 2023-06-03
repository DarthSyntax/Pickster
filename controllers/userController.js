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
  const otherUser = await User.findById(req.params.id);
  const currentUser = await User.findOne({
    username: req.body.follower.username,
  });

  const followerMe = otherUser.followers.find(
    (follower) => follower.username === req.body.follower.username
  );

  const imFollowing = currentUser.following.find(
    (following) => following.username === otherUser.username
  );

  //If I am not following this user add me to their list of followers and add them to the list of users I follow
  if (!followerMe || !imFollowing) {
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
      status: "user followed",
      user: user,
      follower: follower,
    });
  } else {
    //If I am following this user remove me from their list of followers and remove them from the list of users I follow
    console.log(
      followerMe.username,
      "is trying to unfollow",
      imFollowing.username
    );
    console.log(
      `${followerMe.username} is trying to remove ${imFollowing.username} from following list`
    );
    const user = await User.findByIdAndUpdate(req.params.id, {
      $pull: {
        followers: followerMe,
      },
    });

    const follower = await User.findOneAndUpdate(
      { username: req.body.follower.username },
      {
        $pull: {
          following: imFollowing,
        },
      }
    );

    res.status(200).json({
      status: "user unfollowed",
      user: user,
      follower: follower,
    });
  }
});

//Maybe list items by date/time created *
//exports.showFeed
