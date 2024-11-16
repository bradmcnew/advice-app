import { body, param } from "express-validator";

// Helper function to check half-hour increments
const isHalfHourIncrement = (time) => {
  const date = new Date(`1970-01-01T${time}Z`);
  return date.getUTCMinutes() % 30 === 0;
};

// Validators for setting availability
const setAvailabilityValidator = () => [
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
    .withMessage("Start time must be a valid time in HH:MM:SS format")
    .custom((value) => {
      if (!isHalfHourIncrement(value)) {
        throw new Error(
          "Start time must be in half-hour increments (e.g., 12:00, 12:30)."
        );
      }
      return true;
    }),
  body("availability.*.end_time")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage("End time must be a valid time in HH:MM:SS format")
    .custom((value, { req, path }) => {
      if (!isHalfHourIncrement(value)) {
        throw new Error(
          "End time must be in half-hour increments (e.g., 12:00, 12:30)."
        );
      }
      const index = parseInt(path.match(/\[(\d+)\]/)[1]);

      const startTime = new Date(
        `1970-01-01T${req.body.availability[index].start_time}Z`
      );
      const endTime = new Date(`1970-01-01T${value}Z`);
      if (endTime <= startTime) {
        throw new Error("End time must be after start time.");
      }
      return true;
    }),
];

// Validators for updating availability
const updateAvailabilityValidator = () => [
  param("availability_id")
    .isUUID()
    .withMessage("availability_id must be a valid UUID"),
  body("start_time")
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage("Start time must be a valid time in HH:MM:SS format")
    .custom((value) => {
      if (value && !isHalfHourIncrement(value)) {
        throw new Error(
          "Start time must be in half-hour increments (e.g., 12:00, 12:30)."
        );
      }
      return true;
    }),
  body("end_time")
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-5][0-9]$/)
    .withMessage("End time must be a valid time in HH:MM:SS format")
    .custom((value, { req }) => {
      if (value && !isHalfHourIncrement(value)) {
        throw new Error(
          "End time must be in half-hour increments (e.g., 12:00, 12:30)."
        );
      }
      // Ensure end time is after start time
      if (req.body.start_time) {
        const startTime = new Date(`1970-01-01T${req.body.start_time}Z`);
        const endTime = new Date(`1970-01-01T${value}Z`);
        if (endTime <= startTime) {
          throw new Error("End time must be after start time.");
        }
      }
      return true;
    }),
];

// Validators for fetching availability
const getAvailabilityValidator = () => [
  param("user_profile_id")
    .isUUID()
    .withMessage("user_profile_id must be a valid UUID"),
];

export {
  setAvailabilityValidator,
  updateAvailabilityValidator,
  getAvailabilityValidator,
};
