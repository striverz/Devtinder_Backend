const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcryptjs");

const cookieParser = require("cookie-parser");
const authUser = require("./middlewares/user");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validating the signupdetails
    validateSignUpData(req.body);

    //encrypting the password;
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const { firstName, lastName, emailId, password } = req.body;

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User is Added");
  } catch (err) {
    res.status(401).send("ERROR : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const findUser = await User.findOne({ emailId: req.body.emailId });

    if (!findUser) throw new Error("Email is Not registered");

    const hashPassword = findUser.password;

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      hashPassword
    );
    if (isPasswordValid) {
      const token = await findUser.getJWT();

      res.cookie("token", token);
      res.send("Logined Successfully");
    } else {
      throw new Error("Password is Wrong");
    }
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

app.get("/profile", authUser, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.send("ERROR : " + err.message);
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
