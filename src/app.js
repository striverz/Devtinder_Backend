const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

const userAuth = require("./routes/auth");
const profileRouter = require("./routes/profile");

app.use(express.json()); //middle ware for reading json data
app.use(cookieParser()); //middle ware for reading the cookies

app.use("/", userAuth);
app.use("/", profileRouter);

connectDB()
  .then(() => {
    console.log("Data Base Connected");
    app.listen(3333, () => console.log("App listed at port 3333"));
  })
  .catch((err) => {
    console.log("Data Base Not Connected");
  });
