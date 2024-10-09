const express = require("express");
const router = express.Router();
const passport = require("passport");

// Import validation middleware for user registration
const {
  userValidationRules,
  validateUser,
} = require("../../middleware/validators/userRegisterValidator");

// Import the controller for user registration
const registerUserController = require("../../controllers/registerUserController");

// Import validation middleware for user login
const {
  loginValidationRules,
  validate,
} = require("../../middleware/validators/userLoginValidator");

// Import the controller for user login
const loginUserController = require("../../controllers/loginUserController");

// Import the controller for user logout
const logoutUserController = require("../../controllers/logoutUserController");

// Import the controller for forgot password and reset password
const {
  forgotPassword,
  resetPassword,
} = require("../../controllers/resetUserPasswordController");

// Import the password rate limiter middleware
const passwordRateLimiter = require("../../utils/passwordRateLimiter");

// Import the validation middleware for password reset
const {
  resetPasswordValidationRules,
  validateResetPassword,
} = require("../../middleware/validators/userResetPasswordValidator");
const ensureAuthenticated = require("../../middleware/Auth");
const { authenticate } = require("passport");

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post(
  "/register",
  userValidationRules(),
  validateUser,
  registerUserController
);

// @route POST /api/users/auth/login
// @desc Authenticate a user and log them in
// @access Public
router.post(
  "/auth/login",
  loginValidationRules(),
  validate,
  loginUserController
);

// @route POST /api/users/auth/logout
// @desc Log out the current authenticated user
// @access Public
router.post("/auth/logout", logoutUserController);

// @route POST /api/users/auth/forgot-password
// @desc Send a password reset email to the user
// @access Public
router.post("/auth/forgot-password", passwordRateLimiter, forgotPassword);

// @route POST /api/users/auth/reset-password
// @desc Reset the user's password
// @access Public
router.post(
  "/auth/reset-password/:token",
  resetPasswordValidationRules(),
  validateResetPassword,
  resetPassword
);

// @route GET /api/users/dashboard
// @desc Get the dashboard for the authenticated user
// @access Private
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  // Respond with user information or any dashboard data

  const {
    id,
    password_hash,
    created_at,
    updated_at,
    reset_token,
    reset_token_expiration,
    ...userData
  } = req.user;
  res.status(200).json({
    message: "Welcome to your dashboard!",
    user: userData, // Accessing the logged-in user's info
  });
});

// authentication check route
router.get("/auth/check-session", ensureAuthenticated, (req, res) => {
  res.status(200).json({ authenticated: true });
});

// Export the router to use in the main application
module.exports = router;
