const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/deduct", authenticate, userController.deductBalance);
router.get("/userInfo", userController.getUserInfo);

module.exports = router;
