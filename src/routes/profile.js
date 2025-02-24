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
    const isValid = validateEditFields(req.body);

    if (!isValid) {
      throw new Error("The Requested Fields are Not valid to Edit");
    }
    console.log(req.user);
    const update = req.user;
    update.firstName = req.body.firstName;
    await update.save();
    res.send(`${update.lastName} your firstName updated`);
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
