const express = require("express");
const checkAuth = require("../../middleware/auth");
const {
  viewProfile,
} = require("../../controllers/profile/viewProfileController");
const {
  editProfile,
} = require("../../controllers/profile/editProfileController");
const {
  profileValidationRules,
  validateProfile,
} = require("../../middleware/validators/editProfileValidator");
const multer = require("multer");
const path = require("path");
const {
  uploadProfilePicture,
} = require("../../controllers/profile/uploadProfilePictureController");
const profilePicUpload = require("../../config/profilePicUpload");
const resumeUpload = require("../../config/resumeUpload");
const { isCollegeStudent } = require("../../middleware/isCollegeStudent");
const {
  uploadResume,
} = require("../../controllers/profile/uploadResumeController");

const router = express.Router();

// GET: View logged-in user's profile (changes based on user type)
router.get("/", checkAuth, viewProfile);

// PUT: Update profile details (bio, contact info, profile picture)
router.put(
  "/edit",
  checkAuth,
  profileValidationRules(),
  validateProfile,
  editProfile
);

// POST: Upload profile picture
router.post(
  "/photo-upload",
  checkAuth,
  profilePicUpload.single("profile_picture"),
  uploadProfilePicture
);

// POST: Upload resume (only accessible by college students)
router.post(
  "/resume-upload",
  checkAuth,
  isCollegeStudent,
  resumeUpload.single("resume"),
  uploadResume
);

// // PUT: Manage skills (only accessible by college students)
// router.put("/skills", checkAuth, isCollegeStudent, manageSkills);

// // PUT: Set availability for consultations (only for college students)
// router.put("/availability", checkAuth, isCollegeStudent, setAvailability);

// // GET: View all reviews written by or for the user
// router.get("/reviews", checkAuth, viewReviews);

// // GET: View another user's public profile
// router.get("/profile/:id", checkAuth, viewPublicProfile);

// // GET: View portfolio of a selected college student
// router.get("/portfolio", checkAuth, viewPortfolio);

// // GET: View all reviews and ratings for a selected college student
// router.get("/reviews/:id", checkAuth, viewUserReviews);

// // GET: View available times for consultation with the selected college student
// router.get("/schedule/:id", checkAuth, viewUserSchedule);

module.exports = router;
