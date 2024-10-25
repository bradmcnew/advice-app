const { body, param, validationResult } = require("express-validator");

// Validators for setting availability
const setAvailabilityValidator = () => {
  return [
    body("availability")
      .isArray({ min: 1 })
      .withMessage("Availability must be a non-empty array"),
    body("availability.*.day_of_week")
      .isString()
      .isIn([
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ])
      .withMessage("Invalid day of week"),
    body("availability.*.start_time")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
      .withMessage("Start time must be a valid time in HH:MM:SS format"),
    body("availability.*.end_time")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
      .withMessage("End time must be a valid time in HH:MM:SS format"),
  ];
};

// Validators for updating availability
const updateAvailabilityValidator = () => {
  return [
    param("availability_id")
      .isUUID()
      .withMessage("availability_id must be a valid UUID"),
    body("start_time")
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
      .withMessage("Start time must be a valid time in HH:MM:SS format"),
    body("end_time")
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
      .withMessage("End time must be a valid time in HH:MM:SS format"),
  ];
};

// Validators for fetching availability
const getAvailabilityValidator = () => {
  return [
    param("user_profile_id")
      .isUUID()
      .withMessage("user_profile_id must be a valid UUID"),
  ];
};

// Middleware to validate the request and return errors if present
const validateAvailability = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  setAvailabilityValidator,
  updateAvailabilityValidator,
  getAvailabilityValidator,
  validateAvailability,
};
