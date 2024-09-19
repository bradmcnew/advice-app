const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
  return [
    // Validate and sanitize fields
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ max: 50 })
      .withMessage("Username must not exceed 50 characters"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .isLength({ max: 100 })
      .withMessage("Email must not exceed 100 characters"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["high_school", "college_student"])
      .withMessage("Role must be either 'high_school' or 'college_student'"),
  ];
};

const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  userValidationRules,
  validateUser,
};
