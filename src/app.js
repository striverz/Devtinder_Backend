const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const port = 3333;

const userAuth = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
var cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  })
);

app.use(express.json()); //middle ware for reading json data
app.use(cookieParser()); //middle ware for reading the cookies

app.use("/", userAuth);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Data Base Connected");
    app.listen(port, () =>
      console.log(`Server is running on https://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.log("Data Base Not Connected");
  });
