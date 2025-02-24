const express = require("express");
const profileRouter = express.Router();
const authUser = require("../middlewares/user");

profileRouter.get("/profile", authUser, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
