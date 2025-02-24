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
  try {
    const allowedEditFields = ["firstName", "lastName", "about", "skills"];

    const isEditAllowed = Object.keys(data).every((field) =>
      allowedEditFields.includes(field)
    );
    return isEditAllowed;
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
};

module.exports = { validateSignUpData, validateEditFields };
