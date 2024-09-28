const resetService = require("../services/userForgotPasswordService");
const { User } = require("../models");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await resetService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new reset token
    const token = resetService.generateResetToken();

    // Save the reset token and its expiration time
    await resetService.saveResetToken(user, token);

    // Send the password reset email
    await resetService.sendPasswordReset(user.email, token);

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;

  const { newPassword, confirmPassword } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Reset token is required" });
  }

  // Check if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await User.findOne({
      where: { reset_token: resetService.hashToken(token) },
    });
    if (!user || !resetService.isResetTokenValid(user)) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash and set the new password
    await user.setPassword(newPassword);

    // Clear the reset token and expiration
    user.reset_token = null;
    user.reset_token_expiration = null;
    await user.save(); // Save the user to the database

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { forgotPassword, resetPassword };
