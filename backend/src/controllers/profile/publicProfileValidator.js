const { param, validationResult } = require("express-validator");

// Validator for viewing another users profile
const publicProfileViewValidationRules = () => [
  param("id").isUUID().withMessage("User ID must be a valid UUID"),
];

// Middleware to handle validation result
const validatePublicProfileView = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  publicProfileViewValidationRules,
  validatePublicProfileView,
};
