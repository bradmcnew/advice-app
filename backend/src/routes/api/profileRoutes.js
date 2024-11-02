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
} = require("../../middleware/validators/profile/editProfileValidator");
const {
  uploadProfilePicture,
} = require("../../controllers/profile/uploadProfilePictureController");
const profilePicUpload = require("../../config/profilePicUpload");
const resumeUpload = require("../../config/resumeUpload");
const { isCollegeStudent } = require("../../middleware/isCollegeStudent");
const {
  uploadResume,
} = require("../../controllers/profile/uploadResumeController");
const {
  manageSkills,
} = require("../../controllers/profile/editSkillsController");
const {
  viewPublicProfile,
} = require("../../controllers/profile/viewPublicProfileController");
const {
  getReviewsForUser,
} = require("../../controllers/reviews/reviewsController");
const {
  profilePicUploadValidationRules,
} = require("../../middleware/validators/profile/uploadProfilePicValidator");
const {
  resumeUploadValidationRules,
} = require("../../middleware/validators/profile/uploadResumeValidator");
const {
  skillsValidationRules,
} = require("../../middleware/validators/profile/manageSkillsValidator");
const {
  publicProfileViewValidationRules,
} = require("../../controllers/profile/publicProfileValidator");
const validateRequest = require("../../middleware/validators/validateRequest");

const router = express.Router();

// GET: View logged-in user's profile (changes based on user type)
router.get("/", checkAuth, viewProfile);

// PUT: Update profile details (bio, contact info, profile picture)
router.put(
  "/edit",
  checkAuth,
  profileValidationRules(),
  validateRequest,
  editProfile
);

// POST: Upload profile picture
router.post(
  "/photo-upload",
  checkAuth,
  profilePicUpload.single("profile_picture"),
  profilePicUploadValidationRules(),
  validateRequest,
  uploadProfilePicture
);

// POST: Upload resume (only accessible by college students)
router.post(
  "/resume-upload",
  checkAuth,
  isCollegeStudent,
  resumeUpload.single("resume"),
  resumeUploadValidationRules(),
  validateRequest,
  uploadResume
);

// PUT: Manage skills (only accessible by college students)
router.put(
  "/skills",
  checkAuth,
  isCollegeStudent,
  skillsValidationRules(),
  validateRequest,
  manageSkills
);

// // GET: View all reviews written by or for the user
// router.get("/reviews", checkAuth, viewReviews);

// GET: View another user's public profile
router.get(
  "/:id",
  checkAuth,
  publicProfileViewValidationRules(),
  validateRequest,
  viewPublicProfile
);

// // GET: View portfolio of a selected college student
// router.get("/portfolio", checkAuth, viewPortfolio);

// GET: View all reviews and ratings for a selected college student
router.get("/:user_id/reviews", checkAuth, getReviewsForUser);

// // GET: View available times for consultation with the selected college student
// router.get("/schedule/:id", checkAuth, viewUserSchedule);

module.exports = router;
