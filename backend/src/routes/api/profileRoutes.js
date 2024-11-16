import express from "express";
import checkAuth from "../../middleware/auth.js";
import { viewProfile } from "../../controllers/profile/viewProfileController.js";
import { editProfile } from "../../controllers/profile/editProfileController.js";
import { profileValidationRules } from "../../middleware/validators/profile/editProfileValidator.js";
import { uploadProfilePicture } from "../../controllers/profile/uploadProfilePictureController.js";
import { upload } from "../../config/profilePicUpload.js";
import resumeUpload from "../../config/resumeUpload.js";
import { isCollegeStudent } from "../../middleware/isCollegeStudent.js";
import { uploadResume } from "../../controllers/profile/uploadResumeController.js";
import { manageSkills } from "../../controllers/profile/editSkillsController.js";
import { viewPublicProfile } from "../../controllers/profile/viewPublicProfileController.js";
import { getReviewsForUser } from "../../controllers/reviews/reviewsController.js";
import { profilePicUploadValidationRules } from "../../middleware/validators/profile/uploadProfilePicValidator.js";
import { resumeUploadValidationRules } from "../../middleware/validators/profile/uploadResumeValidator.js";
import { skillsValidationRules } from "../../middleware/validators/profile/manageSkillsValidator.js";
import { publicProfileViewValidationRules } from "../../controllers/profile/publicProfileValidator.js";
import validateRequest from "../../middleware/validators/validateRequest.js";
import { getAllSkills } from "../../controllers/profile/getAllSkills.js";

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
  upload.single("profile_picture"),
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
 * @route GET /api/profile/skills
 * @description Get all available skills
 * @access Public
 */
router.get("/skills", getAllSkills);

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

export default router;
