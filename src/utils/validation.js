const validator = require("validator");

const validateSignUpData = (data) => {
  const { firstName, lastName, emailId, password } = data;
  if (!firstName || !lastName) {
    throw new Error("Name is Not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email Id is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not valid");
  }
};

const validateEditFields = (data) => {
  const keys = Object.keys(data);

  const isValid = keys[0] === "firstName";

  return isValid;
};

module.exports = { validateSignUpData, validateEditFields };
