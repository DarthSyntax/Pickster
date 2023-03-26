const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const picSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    required: [true, "Please provide an image URL"],
    validate: validator.isURL,
  },
  comments: [
    {
      user: String,
      text: String,
      timeCreated: Date,
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  user: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Pic = mongoose.model("Pic", picSchema);

module.exports = Pic;
