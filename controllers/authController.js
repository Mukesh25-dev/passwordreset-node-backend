const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Temporary in-memory store for reset tokens (use a database in production)
const tokenStore = {};

// Password reset request handler
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(`Password reset requested for email: ${email}`);

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save the token and email in memory (use a database in production)
    tokenStore[email] = {
      token: resetToken,
      expiry: Date.now() + 3600000, // Token valid for 1 hour
    };

    // Create a password reset URL
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;

    // Set up the email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset Request</h1>
        <p>If you requested a password reset, click the link below:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${email}`);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error during password reset request:", error);
    res.status(500).json({
      message: "An error occurred while sending the reset email",
      error: error.message,
    });
  }
};

// Password reset handler
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    // Validate token
    if (
      !tokenStore[email] ||
      tokenStore[email].token !== token ||
      tokenStore[email].expiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // In a real app, update the user's password in the database
    console.log(`Password for ${email} has been reset to: ${newPassword}`);

    // Remove token after successful password reset
    delete tokenStore[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({
      message: "An error occurred while resetting the password",
      error: error.message,
    });
  }
};
