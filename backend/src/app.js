const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const pool = require("./config/db");
const userRoutes = require("./routes/api/userRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

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
