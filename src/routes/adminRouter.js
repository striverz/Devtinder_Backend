const express = require("express");
const authUser = require("../middlewares/user");
const { User } = require("../models/user");

const adminRouter = express.Router();

adminRouter.get("/all-profiles", authUser, async (req, res) => {
  try {
    const findAllUsers = await User.find({});
    res.json({
      message: "The List of users Data",
      allProfiles: findAllUsers,
    });
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
});

module.exports = {
  adminRouter,
};
