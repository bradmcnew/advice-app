const express = require("express");
const passport = require("passport");
const ensureAuthenticated = require("../../middleware/Auth");
const router = express.Router();

/**
 * @route GET /api/auth/google
 * @description Initiates Google authentication for the user.
 * @access Public
 * @params {string} scope - The scope of the authentication request, which includes
 *                          'openid', 'email', and 'profile'.
 * @returns {void} Redirects to Google for authentication.
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["openid", "email", "profile"] })
);

/**
 * @route GET /api/auth/google/redirect
 * @description Callback route that Google redirects to after authentication.
 *              If authentication is successful, the user is redirected to the dashboard.
 *              If it fails, the user is redirected to the login page.
 * @access Public
 * @returns {void} Redirects to the dashboard or login page based on authentication result.
 */
/**
 * @route GET /api/auth/google/redirect
 * @description Callback route that Google redirects to after authentication.
 *              Redirects user to the frontend if authentication is successful.
 * @access Public
 */
router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${CLIENT_URL}/login`);
    }

    console.log("Session after google login", req.session);
    console.log("User after google login", req.user);

    // Set up your environment variables
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

    // Redirect to the frontend (e.g., dashboard or another route)
    return res.redirect(`${CLIENT_URL}/auth/redirect`);
  }
);

/**
 * @route GET /api/auth/user
 * @description Route to fetch the authenticated user's data after login.
 * @access Private (protected)
 * @returns {object} User data (id, username, email, etc.)
 */
router.get("/user", ensureAuthenticated, (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "User not authenticated" });
  }

  // Safely return user data
  const userData = {
    id: req.user.dataValues.id,
    username: req.user.dataValues.username,
    email: req.user.dataValues.email,
    role: req.user.dataValues.role,
    google_id: req.user.dataValues.google_id,
  };

  return res.status(200).json({ success: true, user: userData });
});

module.exports = router;
