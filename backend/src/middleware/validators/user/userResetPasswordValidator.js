import { body } from "express-validator";

// Define validation rules specifically for password reset
const resetPasswordValidationRules = () => [
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

export { resetPasswordValidationRules };
