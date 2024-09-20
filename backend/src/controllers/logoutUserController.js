const logoutUserController = async (req, res) => {
  // Initiate the logout process. `req.logout` is typically provided by Passport.js to handle the logout functionality.
  req.logout((err) => {
    if (err) {
      // If an error occurs during logout, pass it to the next error handler middleware.
      return next(err);
    }

    // Destroy the user's session. This ensures that the session data is removed from the store, preventing unauthorized access.
    req.session.destroy((err) => {
      if (err) {
        // If an error occurs during session destruction, return a 500 status code indicating a server error.
        return res.status(500).send("Failed to clear session");
      }

      // If logout and session destruction are successful, send a 200 status code to indicate successful logout.
      return res.status(200).send("Logged out successfully");
    });
  });
};

module.exports = logoutUserController;
