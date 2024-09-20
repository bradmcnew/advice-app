/**
 * Middleware function for handling errors in the application.
 * @param {Object} err - The error object containing information about the error.
 * @param {Object} req - The request object representing the HTTP request.
 * @param {Object} res - The response object used to send responses to the client.
 * @param {Function} next - The next middleware function to call (not used here).
 */
const errorHandler = (err, req, res, next) => {
  // Log the error stack for debugging purposes
  console.error(err.stack);

  // Determine the HTTP status code to return
  // Default to 500 if no status is set on the error
  const statusCode = err.status || 500;

  // Send a structured JSON response to the client with error details
  res.json({
    error: {
      status: "error", // Indicate that an error occurred
      statusCode, // Include the HTTP status code
      message: err.message || "An unexpected error occurred", // Provide a descriptive error message
    },
  });
};

// Export the error handler for use in the application
module.exports = errorHandler;
