const app = require("./app");
const port = 9000 || process.env.PORT;
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MDBCONNECTSTRING, () => {
  console.log("connected to db");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
