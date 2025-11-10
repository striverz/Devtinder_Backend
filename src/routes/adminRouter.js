const express = require("express");
const authUser = require("../middlewares/user");
const { User } = require("../models/user");

const adminRouter = express.Router();

adminRouter.get("/all-profiles", authUser, async (req, res) => {
  try {
    const allUsers = await User.find({});

    res.json({
      message: "List of all users Profiles",
      allProfiles: allUsers,
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
