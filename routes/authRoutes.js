const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// POST /request-password-reset
router.post("/request-password-reset", authController.requestPasswordReset);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
