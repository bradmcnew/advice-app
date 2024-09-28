const { body, validationResult } = require("express-validator");

// Define validation rules specifically for password reset
const resetPasswordValidationRules = () => {
  return [
    // Validate the token field
    body("token").notEmpty().withMessage("Reset token is required"),

    // Validate the new password field
    body("newPassword")
      .notEmpty() // Ensure the field is not empty
      .withMessage("Password is required")
      .isLength({ min: 6 }) // Check the minimum length
      .withMessage("Password must be at least 6 characters long"),

    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirmation password is required") // Ensure the field is not empty
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("Password confirmation does not match.");
        }
        return true; // Indicates the success of this synchronous custom validator
      }),
  ];
};

// Middleware to validate the request
const validateResetPassword = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If errors exist, log and return a 400 response with the error details
    console.log(errors.array()); // This logs the validation errors to the console
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  resetPasswordValidationRules,
  validateResetPassword,
};
