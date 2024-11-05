/**
 * @file ProfileRoutes.js - Profile management routes
 * @description Handles all profile-related routes including profile viewing, editing,
 * photo uploads, resume management, and skills management.
 * @requires express
 * @requires auth middleware
 * @module routes/api/profileRoutes
 */

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

/**
 * Profile View Routes
 * @group Profile - Operations about user profiles
 */

/**
 * @route GET /api/profile
 * @description Get the logged-in user's profile information
 * @access Private - Requires authentication
 */
router.get("/", checkAuth, viewProfile);

/**
 * Profile Edit Routes
 * @group Profile Management - Operations for updating profile information
 */

/**
 * @route PUT /api/profile/edit
 * @description Update user profile details
 * @access Private - Requires authentication
 * @validation Requires profile validation rules
 */
router.put(
  "/edit",
  checkAuth,
  profileValidationRules(),
  validateRequest,
  editProfile
);

/**
 * Media Upload Routes
 * @group Profile Media - Operations for managing profile media
 */

/**
 * @route POST /api/profile/photo-upload
 * @description Upload user profile picture
 * @access Private - Requires authentication
 * @validation Validates file type and size
 * @middleware Uses multer for file upload
 */
router.post(
  "/photo-upload",
  checkAuth,
  profilePicUpload.single("profile_picture"),
  profilePicUploadValidationRules(),
  validateRequest,
  uploadProfilePicture
);

/**
 * Resume Management Routes
 * @group College Student Features - Operations specific to college students
 */

/**
 * @route POST /api/profile/resume-upload
 * @description Upload college student resume
 * @access Private - Requires authentication and college student role
 * @validation Validates file type and size
 * @middleware Uses multer for file upload
 */
router.post(
  "/resume-upload",
  checkAuth,
  isCollegeStudent,
  resumeUpload.single("resume"),
  resumeUploadValidationRules(),
  validateRequest,
  uploadResume
);

/**
 * Skills Management Routes
 * @group College Student Features
 */

/**
 * @route PUT /api/profile/skills
 * @description Update college student skills
 * @access Private - Requires authentication and college student role
 * @validation Validates skills format and limits
 */
router.put(
  "/skills",
  checkAuth,
  isCollegeStudent,
  skillsValidationRules(),
  validateRequest,
  manageSkills
);

/**
 * Public Profile Routes
 * @group Profile Viewing - Operations for viewing other users' profiles
 */

/**
 * @route GET /api/profile/:id
 * @description View another user's public profile
 * @param {string} id - User ID to view
 * @access Private - Requires authentication
 */

router.get(
  "/:id",
  checkAuth,
  publicProfileViewValidationRules(),
  validateRequest,
  viewPublicProfile
);

/**
 * Reviews Routes
 * @group User Reviews - Operations for managing user reviews
 */

/**
 * @route GET /api/profile/:user_id/reviews
 * @description Get all reviews for a specific user
 * @param {string} user_id - User ID to get reviews for
 * @access Private - Requires authentication
 */
router.get("/:user_id/reviews", checkAuth, getReviewsForUser);

// Routes planned for future implementation
/**
 * @todo Implement portfolio viewing
 * @todo Implement consultation schedule viewing
 */

module.exports = router;
