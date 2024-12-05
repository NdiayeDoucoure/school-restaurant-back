const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  matricule: String,
  password: String,
  balance: { type: Number, default: 10000.0 },
});

module.exports = mongoose.model("User", userSchema);
