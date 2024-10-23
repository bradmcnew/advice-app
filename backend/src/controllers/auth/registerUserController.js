const { registerUser } = require("../../services/userRegisterService");

const registerUserController = async (req, res, next) => {
  try {
    // Attempt to register the user with the provided request body
    const result = await registerUser(req.body);

    // Check if the registration was successful
    if (!result.success) {
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

module.exports = registerUserController;
