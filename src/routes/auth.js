const express = require("express");
const userAuth = express.Router();
const bcrypt = require("bcryptjs");
const { validateSignUpData } = require("../utils/validation");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

userAuth.post("/signup", async (req, res) => {
  try {
    //validating the signupdetails
    validateSignUpData(req.body);
    const { firstName, lastName, emailId, password } = req.body;

    //Find whether the duplicate user found or not

    const userFound = await User.findOne({ emailId: emailId });
    if (userFound) throw new Error("User with this email is Already Existed.");

    //encrypting the password;
    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    res.json({
      message: "User signup Successful",
    });
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
});

userAuth.post("/signin", async (req, res) => {
  try {
    const findUser = await User.findOne({ emailId: req.body.emailId });

    if (!findUser) {
      return res.status(401).json({ error: "Invalid Credentials!" });
    }

    const hashPassword = findUser.password;

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      hashPassword
    );
    if (!isPasswordValid) throw new Error(" Invalid Credentials!");

    //If Everything was fine then only create token and send the user back

    const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET);

    res.cookie("token", token);
    res.json({
      message: "User Login Successful",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

userAuth.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully");
});
module.exports = userAuth;
