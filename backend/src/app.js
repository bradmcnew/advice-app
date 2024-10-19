const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
//routes
const userRoutes = require("./routes/api/userRoutes");
const googleRoutes = require("./routes/api/googleRoutes");
const errorHandler = require("./middleware/errorHandler");
const passport = require("passport");
const passportConfig = require("./config/passport");
const cors = require("cors");
const morgan = require("morgan");

// Load environment variables from .env file
// This is essential for managing environment-specific settings securely
dotenv.config();

const app = express();

// Logging
// Log HTTP requests to the console
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

// Passport configuration
// Initializes Passport and sets up the authentication strategy
passportConfig(passport);

// Middleware
// Parse incoming JSON requests
// This middleware parses JSON bodies in requests, enabling easy access to request data
app.use(express.json());

// Parse incoming URL-encoded requests
// This middleware parses URL-encoded bodies, which is useful for form submissions
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Session configuration
// Configures session management for tracking user sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret for session encryption, should be kept confidential
    resave: false, // Prevents resaving session if unmodified, reducing unnecessary storage operations
    saveUninitialized: false, // Saves a new session even if it’s not modified, useful for tracking new sessions
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    }, // Set to true if you're using HTTPS to ensure cookies are only sent over secure channels
    rolling: true, // Reset maxAge on every response, extending the session duration
  })
);

// Initialize Passport for authentication
// Passport must be initialized before it can be used for user authentication
app.use(passport.initialize());
app.use(passport.session());

// API routes
// Mounts the userRoutes middleware to handle routes under /api/users
app.use("/api/users", userRoutes);
// oauth routes
app.use("/api/auth", googleRoutes);

// Error handler middleware
// Provides a centralized place to handle errors, improving maintainability and debugging
app.use(errorHandler);

// Export the Express app for use in server.js or other modules
// This allows the app to be imported and used in other parts of the application
module.exports = app;
