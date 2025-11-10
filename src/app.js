const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const userAuth = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json()); // Middleware for JSON parsing
app.use(cookieParser()); // Middleware for handling cookies

// ✅ Optional: Health check endpoint (for debugging)
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/v1/api", userAuth);
app.use("/v1/api", profileRouter);
app.use("/v1/api", requestRouter);
app.use("/v1/api", userRouter);

// ✅ Fix: Improved database connection error handling
connectDB()
  .then(() => {
    console.log("✅ Database Connected");
    app.listen(process.env.PORT_NUMBER, () =>
      console.log(
        `🚀 Server is running on http://localhost:${process.env.PORT_NUMBER}`
      )
    );
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err);
  });
