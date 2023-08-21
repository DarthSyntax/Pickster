const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    minLength: 8,
  },
  profilePic: {
    type: String,
    default: "https://i.imgur.com/yvgPWkI.png",
  },
  bio: {
    type: String,
    default: "Hi, I am new to Pickster!",
  },
  followers: [
    {
      username: String,
      _id: String,
      profilePic: String,
    },
  ],
  following: [
    {
      username: String,
      _id: String,
      profilePic: String,
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  pictures: {
    type: [String],
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  password
) {
  //commented out because the mock users passwords are not hashed yet
  // return await bcrypt.compare(candidatePassword, password);
  return candidatePassword === password;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
