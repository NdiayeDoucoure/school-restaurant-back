const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};
