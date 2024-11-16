import express from "express";
import {
  setAvailability,
  updateAvailability,
  getAvailability,
} from "../../controllers/availability/availabilityController.js";
import checkAuth from "../../middleware/auth.js";
import { isCollegeStudent } from "../../middleware/isCollegeStudent.js";
import {
  setAvailabilityValidator,
  updateAvailabilityValidator,
  getAvailabilityValidator,
} from "../../middleware/validators/availabilityValidators.js";
import validateRequest from "../../middleware/validators/validateRequest.js";
import limiter from "../../utils/rateLimiter.js";

const router = express.Router();

// Route to set availability (POST /availability)
router.post(
  "/",
  limiter,
  checkAuth,
  isCollegeStudent,
  setAvailabilityValidator(),
  validateRequest,
  setAvailability
);

// Route to update availability (PUT /availability/:id)
router.put(
  "/:availability_id",
  limiter,
  checkAuth,
  isCollegeStudent,
  updateAvailabilityValidator(),
  validateRequest,
  updateAvailability
);

// Route to get availability (GET /availability/:user_profile_id)
router.get(
  "/:user_profile_id",
  limiter,
  checkAuth,
  getAvailabilityValidator(),
  validateRequest,
  getAvailability
);

export default router;
