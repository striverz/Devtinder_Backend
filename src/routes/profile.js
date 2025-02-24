const express = require("express");
const profileRouter = express.Router();
const authUser = require("../middlewares/user");
const { validateEditFields } = require("../utils/validation");
const bcrypt = require("bcryptjs");
const validator = require("validator");

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    //validating the Edit fields(i.e firstName,lastName,about,skills);
    const isEditAllowed = validateEditFields(req.body);
    if (!isEditAllowed)
      throw new Error("The Edit is Not allowed for some fields");

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.send(`Hey! ${loggedInUser.firstName} your details are updated`);
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //get the old and new password
    const { currentPassword, newPassword } = req.body;

    //verify the currentPassword currect or wrong
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      loggedInUser.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("The current Password in Invalid");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("new Password is not strong");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = passwordHash;

    await loggedInUser.save();
    res.send("The Password is Changed Successfully");
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
