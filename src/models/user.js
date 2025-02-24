const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 3,
  },
  lastName: {
    type: String,
    minLength: 3,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder");
  return token;
};
const User = mongoose.model("User", userSchema);
module.exports = { User };
