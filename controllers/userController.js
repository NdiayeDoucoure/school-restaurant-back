const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwtUtils = require("../utils/jwtUtils");
require("dotenv").config();

const MATRICULE_REGEX = /^ETUD-\d{5}$/; // Format imposé : ETUD-XXXXX

exports.signup = async (req, res) => {
  const { fullName, matricule, password } = req.body;

  if (!MATRICULE_REGEX.test(matricule)) {
    return res
      .status(400)
      .send("Matricule invalide. Format attendu : ETUD-XXXXX");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      matricule,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send("Utilisateur créé avec succès");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("Matricule déjà utilisé");
    }
    console.error(error);
    res.status(500).send("Erreur interne du serveur");
  }
};

exports.login = async (req, res) => {
  const { matricule, password } = req.body;

  try {
    const user = await User.findOne({ matricule });
    if (!user) return res.status(404).send("Utilisateur non trouvé");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).send("Identifiants invalides");

    const token = jwtUtils.generateToken(user._id);
    res.status(200).json({
      token,
      fullName: user.fullName,
      balance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur interne du serveur");
  }
};

exports.deductBalance = async (req, res) => {
  const { deductionAmount } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("Utilisateur non trouvé");

    if (user.balance < deductionAmount) {
      return res.status(400).send("Solde insuffisant");
    }

    user.balance -= deductionAmount;
    await user.save();
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur interne du serveur");
  }
};

exports.getUserInfo = async (req, res) => {
  const { matricule } = req.body;

  try {
    const user = await User.findOne({ matricule });
    if (!user) return res.status(404).send("Utilisateur non trouvé");

    res.status(200).json({
      fullName: user.fullName,
      matricule: user.matricule,
      balance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur interne du serveur");
  }
};
