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
      default: "https://wallpapercave.com/wp/wp3067438.jpg",
    },
    about: {
      default: "This is default one",
      type: String,
      maxLength: 300,
    },
    skills: {
      type: [String],
    },
    designation: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, {
    expiresIn: "1h",
  });
  return token;
};
const User = mongoose.model("User", userSchema);
module.exports = { User };
