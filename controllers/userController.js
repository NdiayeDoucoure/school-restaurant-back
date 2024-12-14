const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwtUtils = require("../utils/jwtUtils");
require("dotenv").config();

const MATRICULE_ETUD_REGEX = /^ETUD-\d{5}$/;
const MATRICULE_PERS_REGEX = /^PERS-\d{5}$/;

// Inscription d'un utilisateur
exports.signup = async (req, res) => {
  const { fullName, matricule, password, role } = req.body;

  // Validation du matricule en fonction du rôle
  if (role === "Etudiant" && !MATRICULE_ETUD_REGEX.test(matricule)) {
    return res
      .status(400)
      .send("Matricule invalide pour un étudiant. Format attendu : ETUD-XXXXX");
  }

  if (role === "Personnel" && !MATRICULE_PERS_REGEX.test(matricule)) {
    return res
      .status(400)
      .send(
        "Matricule invalide pour un personnel. Format attendu : PERS-XXXXX"
      );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      matricule,
      password: hashedPassword,
      role,
    });

    if (role === "Personnel") {
      newUser.balance = undefined;
    }

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

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  const { matricule, password } = req.body;

  try {
    const user = await User.findOne({ matricule });
    if (!user) return res.status(404).send("Utilisateur non trouvé");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).send("Identifiants invalides");

    const token = jwtUtils.generateToken(user._id, user.role);
    res.status(200).json({
      token,
      fullName: user.fullName,
      balance: user.balance,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur interne du serveur");
  }
};

// Déduire un montant du solde de l'étudiant
exports.deductBalance = async (req, res) => {
  const { deductionAmount, matricule } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("Utilisateur non trouvé");

    if (user.role !== "Personnel") {
      return res
        .status(403)
        .send("Seul le personnel peut effectuer des déductions");
    }

    const student = await User.findOne({ matricule });
    if (!student) return res.status(404).send("Étudiant non trouvé");

    //Lerluu - id
    if (user._id.toString() === student._id.toString()) {
      return res
        .status(400)
        .send("Le personnel ne peut pas déduire de son propre solde");
    }

    if (student.balance < deductionAmount) {
      return res.status(400).send("Solde insuffisant pour cet étudiant");
    }

    student.balance -= deductionAmount;
    await student.save();

    res.status(200).json({
      balance: student.balance,
      matricule: student.matricule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur interne du serveur");
  }
};

// Récupérer les informations d'un utilisateur
exports.getUserInfo = async (req, res) => {
  const { matricule } = req.body;

  try {
    const user = await User.findOne({ matricule });
    if (!user) return res.status(404).send("Utilisateur non trouvé");

    res.status(200).json({
      fullName: user.fullName,
      matricule: user.matricule,
      balance: user.balance,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur interne du serveur");
  }
};
