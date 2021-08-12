


const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const password = process.env.MONGO_PASS;
mongoose.connect(
  `mongodb+srv://prakhar:prakhar2306@cluster0.ud330.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);
module.exports = {
  connection: mongoose.connection,
};
