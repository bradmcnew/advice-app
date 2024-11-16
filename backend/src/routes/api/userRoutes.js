import express from "express";
import passport from "passport";

// Import validation middleware for user registration
import { userValidationRules } from "../../middleware/validators/user/userRegisterValidator.js";

// Import the controller for user registration
import registerUserController from "../../controllers/auth/registerUserController.js";

// Import validation middleware for user login
import { loginValidationRules } from "../../middleware/validators/user/userLoginValidator.js";

// Import the controller for user login
import loginUserController from "../../controllers/auth/loginUserController.js";

// Import the controller for user logout
import logoutUserController from "../../controllers/auth/logoutUserController.js";

// Import the controller for forgot password and reset password
import {
  forgotPassword,
  resetPassword,
} from "../../controllers/auth/resetUserPasswordController.js";

// Import the password rate limiter middleware
import passwordRateLimiter from "../../utils/passwordRateLimiter.js";

// Import the validation middleware for password reset
import { resetPasswordValidationRules } from "../../middleware/validators/user/userResetPasswordValidator.js";

// Import authentication middleware
import ensureAuthenticated from "../../middleware/auth.js";

// Import request validation middleware
import validateRequest from "../../middleware/validators/validateRequest.js";

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post(
  "/register",
  userValidationRules(),
  validateRequest,
  registerUserController
);

// @route POST /api/users/auth/login
// @desc Authenticate a user and log them in
// @access Public
router.post(
  "/auth/login",
  loginValidationRules(),
  validateRequest,
  loginUserController
);

// @route POST /api/users/auth/logout
// @desc Log out the current authenticated user
// @access Public
router.post("/auth/logout", logoutUserController);

// @route POST /api/users/auth/forgot-password
// @desc Send a password reset email to the user
// @access Public
router.post("/auth/forgot-password", passwordRateLimiter, forgotPassword);

// @route POST /api/users/auth/reset-password
// @desc Reset the user's password
// @access Public
router.post(
  "/auth/reset-password/:token",
  resetPasswordValidationRules(),
  validateRequest,
  resetPassword
);

// @route GET /api/users/dashboard
// @desc Get the dashboard for the authenticated user
// @access Private
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const {
    id,
    password_hash,
    created_at,
    updated_at,
    reset_token,
    reset_token_expiration,
    ...userData
  } = req.user;

  res.status(200).json({
    message: "Welcome to your dashboard!",
    user: userData, // Accessing the logged-in user's info
  });
});

// Authentication check route
router.get("/auth/check-session", ensureAuthenticated, (req, res) => {
  res.status(200).json({ authenticated: true });
});

// Export the router to use in the main application
export default router;
