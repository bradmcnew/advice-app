const express = require("express");
const router = express.Router();

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

const logoutUserController = require("../../controllers/logoutUserController");

// Import the controller for user login
const loginUserController = require("../../controllers/loginUserController");

// Import the isAuthenticated middleware to protect routes
const isAuthenticated = require("../../middleware/Auth");

// Import the controller for forgot password and reset password
const {
  forgotPassword,
  resetPassword,
} = require("../../controllers/resetUserPasswordController");

// Import the password rate limiter middleware
const passwordRateLimiter = require("../../utils/passwordRateLimiter");

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post(
  "/register",
  userValidationRules(), // Apply validation rules for user registration
  validateUser, // Validate the request based on defined rules
  registerUserController // Handle user registration
);

// @route POST /api/users/auth/login
// @desc Authenticate a user and log them in
// @access Public
router.post(
  "/auth/login",
  loginValidationRules(), // Apply validation rules for user login
  validate, // Validate the request based on defined rules
  loginUserController // Handle user login
);

// @route POST /api/users/auth/logout
// @desc Log out the current authenticated user
// @access Public
router.post("/auth/logout", isAuthenticated, logoutUserController);

// @route POST /api/users/auth/forgot-password
// @desc Send a password reset email to the user
// @access Public
router.post("/auth/forgot-password", passwordRateLimiter, forgotPassword);

// @route POST /api/users/auth/reset-password
// @desc Reset the user's password
// @access Public
router.post("/auth/reset-password", resetPassword);

// Export the router to use in the main application
module.exports = router;
