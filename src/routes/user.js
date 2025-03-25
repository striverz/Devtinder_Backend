const express = require("express");
const authUser = require("../middlewares/user");
const userRouter = express.Router();
const { ConnectionRequest } = require("../models/connection");
const { User } = require("../models/user");

const USER_SAFE_DATA =
  "firstName lastName  skills about photoURL designation location";

userRouter.get("/user/requests", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      status: "interested",
      toUserId: loggedInUser._id,
    }).populate("fromUserId", USER_SAFE_DATA);
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

    const data = connections.map((row) => {
      if (row?.fromUserId?._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row?.fromUserId;
    });

    res.json({
      message: "the connections you have are",
      data,
    });
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

userRouter.get("/feed", authUser, async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    let skip = (page - 1) * limit;

    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connections.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      data: users,
    });
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

module.exports = userRouter;
