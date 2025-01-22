const express = require("express");
const authenticationController = require("../controllers/authenticationConntroller");

const authenticationRoutes = express.Router();

authenticationRoutes.post("/register", authenticationController.register);

authenticationRoutes.post("/login", authenticationController.login);

module.exports = authenticationRoutes;
