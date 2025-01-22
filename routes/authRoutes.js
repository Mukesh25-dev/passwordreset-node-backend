const express = require("express");
const authController = require("../controllers/authController");
const authenticationController = require("../controllers/authenticationConntroller");

const router = express.Router();

// POST /request-password-reset
router.post("/request-password-reset", authController.requestPasswordReset);

router.post("/reset-password", authController.resetPassword);

router.post("/register", authenticationController.register);

router.post("/login", authenticationController.login);

module.exports = router;
