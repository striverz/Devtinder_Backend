const express = require("express");
const app = express();
const { connectDB } = require("./config/database");

app.use("/test", (req, res) => {
  res.send("Testing Page...Loading");
});
app.use("/", (req, res) => {
  res.send("Hello World!");
});

connectDB()
  .then(() => {
    console.log("Data Base Connected");
    app.listen(3333, () => console.log("App listed at port 3333"));
  })
  .catch((err) => {
    console.log("Data Base Not Connected");
  });
