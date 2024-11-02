// Import the loginUser service to handle user authentication
const { loginUser } = require("../../services/user/userLoginService");

/**
 * Controller function for handling user login.
 * @param {Object} req - The request object containing user credentials.
 * @param {Object} res - The response object used to send responses to the client.
 * @param {Function} next - The next middleware function to call in case of errors.
 */
const loginUserController = async (req, res, next) => {
  try {
    // Attempt to login the user by calling the loginUser service
    const result = await loginUser(req, res, next);

    // Check if the login was unsuccessful
    if (!result.success) {
      console.log("Login failed:", result.message);
      // Return a 401 Unauthorized response with an appropriate message
      return res.status(401).json({ message: result.message });
    }

    console.log("Session after login:", req.session);
    console.log("User after login:", req.user);

    console.log(result.userData);

    // Return a successful login response with user information
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: result.userData,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error during user login:", error);

    res.status(500).json({ message: "An error occurred during login." });
  }
};

// Export the loginUserController for use in routing
module.exports = loginUserController;
