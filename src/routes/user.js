const express = require("express");
const authUser = require("../middlewares/user");
const userRouter = express.Router();
const { ConnectionRequest } = require("../models/connection");

userRouter.get("/user/requests", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      status: "interested",
      toUserId: loggedInUser._id,
    }).populate("fromUserId", "firstName lastName");
    if (!connectionRequests) throw new Error("No connection Requests found");

    const data = connectionRequests;
    res.json({
      message: "The connection requests are",
      data: data,
    });
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId")
      .populate("toUserId");

    res.json({
      message: "the connections you have are",
      connections,
    });
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

module.exports = userRouter;
