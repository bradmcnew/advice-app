const express = require("express");
const passport = require("passport");
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
  "/",
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
router.get(
  "/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("User authenticated:", req.user);
    res.redirect("http://localhost:3000/dashboard"); // Redirect to the dashboard on success
  }
);

module.exports = router;
