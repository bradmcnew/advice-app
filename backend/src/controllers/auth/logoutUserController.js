// Controller function for logging out the user
const logoutUserController = async (req, res, next) => {
  // Start the logout process. `req.logout` is provided by Passport.js to handle user logout.
  req.logout((err) => {
    // Check for errors during the logout process
    if (err) {
      // Pass the error to the next error-handling middleware for proper error handling
      return next(err);
    }

    // Proceed to destroy the user's session to remove any stored session data
    console.log("Session before logout:", req.session);
    req.session.destroy((err) => {
      // Check for errors during session destruction
      if (err) {
        // Create a new error object for session destruction failure
        const error = new Error("Session destruction error");
        error.status = 500; // Set the error status to 500 for server errors
        // Pass the error to the next error-handling middleware
        return next(error);
      }

      // If logout and session destruction are successful, respond with a 200 status
      res.clearCookie("connect.sid", { path: "/" }); // Clear the session cookie for good
      console.log("Session after logout:", req.session);
      return res.status(200).send("Logged out successfully");
    });
  });
};

// Export the logoutUserController function
export default logoutUserController;
