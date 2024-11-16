// Import the registerUser service using ES6 import
import { registerUser } from "../../services/user/userRegisterService.js";

/**
 * Controller function for handling user registration.
 * @param {Object} req - The request object containing the user's registration data.
 * @param {Object} res - The response object used to send responses to the client.
 * @param {Function} next - The next middleware function to call in case of errors.
 */
const registerUserController = async (req, res, next) => {
  try {
    // Attempt to register the user with the provided request body
    const result = await registerUser(req.body);

    // Check if the registration was successful
    if (!result.success) {
      console.log("User registration failed:", result.message);
      // Send an error response with appropriate status code and message
      return res
        .status(result.statusCode || 400) // Default to 400 if statusCode is not provided
        .json({ message: result.message });
    }

    // Send a success response with user information
    res
      .status(result.statusCode || 201) // Default to 201 if statusCode is not provided
      .json({ message: "User registered successfully", user: result.user });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error during user registration:", error);

    // Pass the error to the next middleware (error handler)
    next(error);
  }
};

// Export the registerUserController using ES6 export
export default registerUserController;
