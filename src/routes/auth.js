const express = require("express");
const userAuth = express.Router();
const bcrypt = require("bcryptjs");
const { validateSignUpData } = require("../utils/validation");
const { User } = require("../models/user");

userAuth.post("/signup", async (req, res) => {
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

userAuth.post("/login", async (req, res) => {
  try {
    const findUser = await User.findOne({ emailId: req.body.emailId });

    if (!findUser) throw new Error(" Invalid Credentials!");

    const hashPassword = findUser.password;

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      hashPassword
    );
    if (!isPasswordValid) throw new Error(" Invalid Credentials!");

    //If Everything was fine then only create token and send the user back

    const token = await findUser.getJWT();
    res.cookie("token", token);
    res.send(findUser);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

userAuth.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully");
});
module.exports = userAuth;
