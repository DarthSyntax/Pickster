const Pic = require("./../models/picModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/APIFeatures");
const User = require("./../models/userModel");

exports.getAllPics = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Pic.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const pics = await features.query;
  res.status(200).json({
    status: "success",
    results: pics.length,
    data: pics,
  });
});

exports.createPic = catchAsync(async (req, res, next) => {
  const { caption, image } = req.body;
  const newPic = await Pic.create({
    caption: caption,
    image: image,
    user: req.user.username,
  });

  await User.findOneAndUpdate(
    { username: req.user.username },
    { $addToSet: { pictures: image } }
  );
  res.status(201).json({
    status: "success",
    data: newPic,
  });
});

exports.updatePic = catchAsync(async (req, res, next) => {
  const updatedPic = await Pic.findByIdAndUpdate(
    req.params.id,
    { caption: req.body.caption },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: updatedPic,
  });
});

exports.getPic = catchAsync(async (req, res, next) => {
  let pic = await Pic.findById(req.params.id);
  if (!pic) pic = await Pic.findOne({ image: req.params.id });
  if (!pic) {
    return next(new AppError("No picture found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: pic,
  });
});

exports.deletePic = catchAsync(async (req, res, next) => {
  const pic = await Pic.findByIdAndDelete(req.params.id);
  if (!pic) {
    return next(new AppError("No picture found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.likePic = catchAsync(async (req, res, next) => {
  const pic = await Pic.findByIdAndUpdate(req.params.id, {
    $inc: { likes: 1 },
  });

  res.status(200).json({
    status: "success",
    pic: pic,
  });
});

exports.commentPic = catchAsync(async (req, res, next) => {
  const pic = await Pic.findByIdAndUpdate(req.params.id, {
    $push: { comments: req.body.comment },
  });

  res.status(200).json({
    status: "success",
    comments: pic.comments,
  });
});
