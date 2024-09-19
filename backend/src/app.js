const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const userRoutes = require("./routes/api/userRoutes");
const errorHandler = require("./middleware/errorHandler");
const passport = require("passport");
const passportConfig = require("./middleware/passport");

dotenv.config();

const app = express();

// Passport configuration
passportConfig(passport);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if you're using HTTPS
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/users", userRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
