// Import express-validator methods using ES6 import syntax
import { param, validationResult } from "express-validator";

/**
 * Validator for viewing another user's profile.
 * @returns {Array} Array of validation rules for user ID parameter.
 */
const publicProfileViewValidationRules = () => [
  param("id").isUUID().withMessage("User ID must be a valid UUID"),
];

/**
 * Middleware to handle validation result.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const validatePublicProfileView = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Export the validation and middleware functions using ES6 export syntax
export { publicProfileViewValidationRules, validatePublicProfileView };
