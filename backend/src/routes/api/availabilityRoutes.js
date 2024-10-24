const express = require("express");
const {
  setAvailability,
  updateAvailability,
  getAvailability,
} = require("../../controllers/availability/availabilityController");
const checkAuth = require("../../middleware/auth");
const { isCollegeStudent } = require("../../middleware/isCollegeStudent");

const router = express.Router();

// Route to set availability (POST /availability)
router.post("/", checkAuth, isCollegeStudent, setAvailability);

// Route to update availability (PUT /availability/:id)
router.put("/:id", checkAuth, isCollegeStudent, updateAvailability);

// Route to get availability (GET /availability/:user_profile_id)
router.get("/:user_profile_id", checkAuth, getAvailability);

module.exports = router;
