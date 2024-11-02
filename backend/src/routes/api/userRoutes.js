const express = require("express");
const router = express.Router();
const passport = require("passport");

// Import validation middleware for user registration
const {
  userValidationRules,
} = require("../../middleware/validators/user/userRegisterValidator");

// Import the controller for user registration
const registerUserController = require("../../controllers/auth/registerUserController");

// Import validation middleware for user login
const {
  loginValidationRules,
} = require("../../middleware/validators/user/userLoginValidator");

// Import the controller for user login
const loginUserController = require("../../controllers/auth/loginUserController");

// Import the controller for user logout
const logoutUserController = require("../../controllers/auth/logoutUserController");

// Import the controller for forgot password and reset password
const {
  forgotPassword,
  resetPassword,
} = require("../../controllers/auth/resetUserPasswordController");

// Import the password rate limiter middleware
const passwordRateLimiter = require("../../utils/passwordRateLimiter");

// Import the validation middleware for password reset
const {
  resetPasswordValidationRules,
  validateResetPassword,
} = require("../../middleware/validators/user/userResetPasswordValidator");
const ensureAuthenticated = require("../../middleware/auth");
const validateRequest = require("../../middleware/validators/validateRequest");

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post(
  "/register",
  userValidationRules(),
  validateRequest,
  registerUserController
);

// @route POST /api/users/auth/login
// @desc Authenticate a user and log them in
// @access Public
router.post(
  "/auth/login",
  loginValidationRules(),
  validateRequest,
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
  validateRequest,
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
