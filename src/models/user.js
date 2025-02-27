const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
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
    gender: {
      type: String,
      validate: {
        validator: (value) => {
          if (!["male", "female"].includes(value)) {
            throw new Error("The Gender is Not valid");
          }
        },
      },
    },
    photoURL: {
      type: String,
      default: "https://superman.img",
    },
    about: {
      default: "This is default one",
      type: String,
      maxLength: 100,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder");
  return token;
};
const User = mongoose.model("User", userSchema);
module.exports = { User };
