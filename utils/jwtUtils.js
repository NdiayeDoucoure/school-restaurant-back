const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, JWT_SECRET, { expiresIn: "1h" });
};
