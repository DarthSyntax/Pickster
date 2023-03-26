const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const picRouter = require("./routes/picRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/AppError");
const cors = require("cors");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/pics", picRouter);
app.use("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

module.exports = app;
