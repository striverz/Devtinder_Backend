const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token..!");

    const decodeMsg = await jwt.verify(token, "DevTinder");
    const userId = decodeMsg._id;

    const user = await User.findById(userId);
    req.user = user;
    next();
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
};

module.exports = authUser;
