const passport = require("passport");

/**
 * Logs in a user using Passport.js.
 *
 * This function uses Passport.js to authenticate a user with the "local" strategy.
 * It returns a promise that resolves with the authentication result or rejects with an error.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<Object>} - A promise that resolves with the authentication result.
 */
const loginUser = (req, res, next) => {
  return new Promise((resolve, reject) => {
    // Use Passport.js to authenticate the user with the "local" strategy.
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        // Log the error and reject the promise.
        return reject(err);
      }

      // Check if no user was found; clear session and resolve with a failure message.
      if (!user) {
        // Clear existing session
        req.session.destroy((error) => {
          if (error) {
            console.error("Error destroying session:", error);
          }
          // Resolve with failure message
          return resolve({ success: false, message: info.message });
        });
        return; // Prevent further execution
      }

      // Log in the user using the req.logIn method.
      req.logIn(user, (err) => {
        if (err) {
          // If there's an error during login, reject the promise.
          return reject(err);
        }

        // Destructure the user object to remove sensitive information.
        const {
          id,
          email,
          password_hash,
          created_at,
          updated_at,
          reset_token,
          reset_token_expiration,
          google_id,
          ...userData
        } = req.user.dataValues;

        // Authentication successful; resolve with the user object.
        resolve({ success: true, userData });
      });
    })(req, res, next); // Call the authenticate function with the request and response objects.
  });
};

module.exports = { loginUser };
