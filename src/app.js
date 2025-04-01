const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT || 3333; // Use environment variable for flexibility

const userAuth = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// ✅ Fix: Allow CORS for all origins temporarily OR set your frontend’s actual URL
app.use(
  cors({
    origin: true, // Dynamically allows any requesting origin
    credentials: true, // Allow cookies/tokens to be sent
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  })
);

app.use(express.json()); // Middleware for JSON parsing
app.use(cookieParser()); // Middleware for handling cookies

// ✅ Optional: Health check endpoint (for debugging)
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Routes
app.use("/", userAuth);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// ✅ Fix: Improved database connection error handling
connectDB()
  .then(() => {
    console.log("✅ Database Connected");
    app.listen(port, () =>
      console.log(`🚀 Server is running on http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err);
  });
