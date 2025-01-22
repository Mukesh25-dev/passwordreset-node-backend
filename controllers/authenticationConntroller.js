const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = require("../config/config");

const authenticationController = {
  register: async (request, response) => {
    try {
      const { name, email, password } = request.body;

      const user = await User.findOne({ email });

      if (user) {
        return response.json({ message: "user already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ name, email, password: hashedPassword });

      await newUser.save();

      response.status(201).json({ message: "user registered successfully" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },

  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return response.status(404).json({ message: "User does not exist" });
      }

      // Validate password
      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) {
        return response.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

      // Set token in cookies
      response.cookie("token", token, { httpOnly: true });

      response.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Error in login", error: error.message });
    }
  },
};

module.exports = authenticationController;
