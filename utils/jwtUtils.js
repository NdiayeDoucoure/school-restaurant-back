const jwt = require("jsonwebtoken");
const JWT_SECRET = "supersecretkey";

exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};
