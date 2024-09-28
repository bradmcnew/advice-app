const express = require("express");
const passport = require("passport");
const router = express.Router();

// Route to start Google authentication
router.get(
  "/",
  passport.authenticate("google", { scope: ["openid", "email", "profile"] })
);

// Callback route after Google authenticates the user
router.get(
  "/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Google login successful");
    if (req.user.created) {
      console.log("User created from Google: ", req.user);
    } else {
      console.log("Existing user logged in with Google: ", req.user);
    }
    res.redirect("/dashboard"); // Redirect to the dashboard on success
  }
);

module.exports = router;
