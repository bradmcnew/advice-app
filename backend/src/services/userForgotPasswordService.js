// services/authService.js
const crypto = require("crypto");
const { User } = require("../models");
const { sendPasswordResetEmail } = require("../utils/email");

const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    console.error("Error finding user by email: ", error);
    throw new Error("Database query failed.");
  }
};

const saveResetToken = async (user, token) => {
  user.reset_token = hashToken(token);
  user.reset_token_expiration = Date.now() + 3600000; // 1 hour expiration
  try {
    await user.save();
  } catch (error) {
    console.error("Error saving reset token: ", error);
    throw new Error("Database update failed.");
  }
};

const sendPasswordReset = async (email, token) => {
  // remove when gmail lets nodemailer send emails
  if (process.env.NODE_ENV === "test") {
    return { status: 200, message: "Password reset email sent" };
  }
  const resetUrl = `${process.env.FRONTEND_URL}/users/reset-password/${token}`;
  await sendPasswordResetEmail(email, resetUrl);
};

const isResetTokenValid = (user) => {
  return user.reset_token && user.reset_token_expiration > Date.now();
};

module.exports = {
  generateResetToken,
  findUserByEmail,
  saveResetToken,
  sendPasswordReset,
  isResetTokenValid,
  hashToken,
};
