const { body, validationResult } = require("express-validator");

// Define validation rules for user registration
const userValidationRules = () => {
  return [
    // Validate and sanitize the username field
    body("username")
      .trim() // Remove whitespace from both ends
      .notEmpty() // Ensure the field is not empty
      .withMessage("Username is required")
      .isLength({ max: 50 }) // Check the maximum length
      .withMessage("Username must not exceed 50 characters"),

    // Validate and sanitize the email field
    body("email")
      .trim() // Remove whitespace from both ends
      .notEmpty() // Ensure the field is not empty
      .withMessage("Email is required")
      .isEmail() // Validate email format
      .withMessage("Invalid email format")
      .isLength({ max: 100 }) // Check the maximum length
      .withMessage("Email must not exceed 100 characters"),

    // Validate the password field
    body("password")
      .notEmpty() // Ensure the field is not empty
      .withMessage("Password is required")
      .isLength({ min: 6 }) // Check the minimum length
      .withMessage("Password must be at least 6 characters long"),

    // Validate the role field
    body("role")
      .notEmpty() // Ensure the field is not empty
      .withMessage("Role is required")
      .isIn(["high_school", "college_student"]) // Ensure the role is valid
      .withMessage("Role must be either 'high_school' or 'college_student'"),
  ];
};

module.exports = {
  userValidationRules,
};
