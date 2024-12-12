const mongoose = require("mongoose");
require("dotenv").config();
const DATABASE_URL = process.env.DATABASE_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
