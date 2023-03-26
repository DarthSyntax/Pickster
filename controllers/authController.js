const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const util = require("util");

const signToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id },
    "Ravioli Ravioli give me the Formuoli",
    {
      expiresIn: 90 * 24 * 60 * 60 * 1000,
    }
  );

  res.status(200).json({
    status: "success",
    user: user,
    token: token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  signToken(newUser, res);
});

exports.login = catchAsync(async (req, res, next) => {
  //1) Check if the email and password were entered
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2 Check if the user exists && password is correct
  const user = await User.findOne({ email: email });
  if (!user || !user.correctPassword(password, user.password)) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3) If everything is ok, send token to client
  signToken(user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1 Getting token and check if authorization is

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }

  //2 Verify token
  const decoded = await util.promisify(jwt.verify)(
    token,
    "Ravioli Ravioli give me the Formuoli"
  );

  //3 check if the user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  //4 Check if user changed password after token was issued

  //grant access to protected route
  req.user = user;
  next();
});

exports.restrictedTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
