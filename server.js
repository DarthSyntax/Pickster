const app = require("./app");
const port = 9000 || process.env.PORT;
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://staelp:killacam18@cluster0.rw2xn.mongodb.net/pickster?retryWrites=true&w=majority",
  () => {
    console.log("connected to db");
  }
);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
