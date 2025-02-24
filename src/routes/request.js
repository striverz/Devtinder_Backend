const express = require("express");
const requestRouter = express.Router();

const { ConnectionRequest } = require("../models/connection");
const authUser = require("../middlewares/user");
const { User } = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //1. the fromUserId and toUserId should be different
      if (fromUserId == toUserId)
        throw new Error("The fromUserId and toUserId should be distince");

      //status should be ignored or interested
      const allowedStatus = ["ignored", "interested"];
      const isStatusValid = allowedStatus.includes(status);
      if (!isStatusValid) throw new Error("The status is not valid");

      //sending userId(toUserId) should be presented in out database/app
      const toUser = await User.findById(toUserId);
      if (!toUser) throw new Error("Requested User Not Found in out DB");

      //No duplicate requres should be found
      const connectionExisted = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (connectionExisted)
        throw new Error("The Connect Requted is Already Presented");

      const data = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await data.save();

      res.json({
        message: `${req.user.firstName} You send connection request to ${toUser.firstName} successfully`,
        data,
      });
    } catch (err) {
      res.send("ERROR : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestedId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestedId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      const isStatusValid = allowedStatus.includes(status);
      if (!isStatusValid) throw new Error("Status is Not valid");

      const connectionRequest = await ConnectionRequest.findOne({
        status: "interested",
        toUserId: loggedInUser._id,
        _id: requestedId,
      });
      if (!connectionRequest) throw new Error("Connection is not found");

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.send("Connection is accepted");
    } catch (err) {
      res.send("ERROR : " + err.message);
    }
  }
);

module.exports = requestRouter;
