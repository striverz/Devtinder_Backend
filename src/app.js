const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { User } = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const user = new User(req.body);
    await user.save();
    res.send("User is Added");
  } catch (err) {
    res.status(401).send("ERROR : " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Data Base Connected");
    app.listen(3333, () => console.log("App listed at port 3333"));
  })
  .catch((err) => {
    console.log("Data Base Not Connected");
  });
