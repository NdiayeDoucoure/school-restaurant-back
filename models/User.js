const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  matricule: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 10000.0,
  },
});

module.exports = mongoose.model("User", userSchema);
