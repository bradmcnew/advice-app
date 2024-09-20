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

// Import the controller for user login
const loginUserController = require("../../controllers/loginUserController");

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

// Export the router to use in the main application
module.exports = router;
