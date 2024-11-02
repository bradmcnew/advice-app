const { body, validationResult } = require("express-validator");

// Define validation rules for login
const loginValidationRules = () => {
  return [
    // Validate and sanitize the username field
    body("username")
      .trim() // Remove whitespace from both ends
      .notEmpty() // Ensure the field is not empty
      .withMessage("Username is required")
      .isLength({ max: 50 }) // Check the maximum length
      .withMessage("Username must not exceed 50 characters"),

    // Validate and sanitize the password field
    body("password")
      .notEmpty() // Ensure the field is not empty
      .withMessage("Password is required")
      .isLength({ min: 6 }) // Check the minimum length
      .withMessage("Password must be at least 6 characters long"),
  ];
};

module.exports = {
  loginValidationRules,
};
