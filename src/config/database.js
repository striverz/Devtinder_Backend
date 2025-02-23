const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://striverz:Kmk%400011@devtinder.xmbga.mongodb.net/"
  );
};

module.exports = { connectDB };
