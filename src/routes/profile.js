const express = require("express");
const profileRouter = express.Router();
const authUser = require("../middlewares/user");
const { validateEditFields } = require("../utils/validation");

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
    console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.send(`Hey! ${loggedInUser.firstName} your details are updated`);
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
