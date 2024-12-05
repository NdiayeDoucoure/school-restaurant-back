const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "supersecretkey";

exports.signup = async (req, res) => {
  const { fullName, matricule, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ fullName, matricule, password: hashedPassword });
  await newUser.save();
  res.status(201).send("User created successfully");
};

exports.login = async (req, res) => {
  const { matricule, password } = req.body;
  const user = await User.findOne({ matricule });
  if (!user) return res.status(404).send("User not found");

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return res.status(401).send("Invalid credentials");

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res
    .status(200)
    .json({ token, fullName: user.fullName, balance: user.balance });
};

exports.deductBalance = async (req, res) => {
  const { deductionAmount } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).send("User not found");

  if (user.balance < deductionAmount) {
    return res.status(400).send("Insufficient balance");
  }

  user.balance -= deductionAmount;
  await user.save();
  res.status(200).json({ balance: user.balance });
};
