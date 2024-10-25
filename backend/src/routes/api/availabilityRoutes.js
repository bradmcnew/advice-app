const express = require("express");
const {
  setAvailability,
  updateAvailability,
  getAvailability,
} = require("../../controllers/availability/availabilityController");
const checkAuth = require("../../middleware/auth");
const { isCollegeStudent } = require("../../middleware/isCollegeStudent");
const {
  setAvailabilityValidator,
  updateAvailabilityValidator,
  getAvailabilityValidator,
  validateAvailability,
} = require("../../middleware/validators/availabilityValidators");
const limiter = require("../../utils/rateLimiter");

const router = express.Router();

// Route to set availability (POST /availability)
router.post(
  "/",
  limiter,
  checkAuth,
  isCollegeStudent,
  setAvailabilityValidator(),
  validateAvailability,
  setAvailability
);

// Route to update availability (PUT /availability/:id)
router.put(
  "/:availability_id",
  limiter,
  checkAuth,
  isCollegeStudent,
  updateAvailabilityValidator(),
  validateAvailability,
  updateAvailability
);

// Route to get availability (GET /availability/:user_profile_id)
router.get(
  "/:user_profile_id",
  limiter,
  checkAuth,
  getAvailabilityValidator(),
  validateAvailability,
  getAvailability
);

module.exports = router;
