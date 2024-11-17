import express from "express";
import session from "express-session";
import dotenv from "dotenv";
// Routes
import userRoutes from "./routes/api/userRoutes.js";
import googleRoutes from "./routes/api/googleRoutes.js";
import profileRoutes from "./routes/api/profileRoutes.js";
import availabilityRoutes from "./routes/api/availabilityRoutes.js";

import errorHandler from "./middleware/errorHandler.js";
import passport from "passport";
import passportConfig from "./config/passport.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("development"));
}

// Passport configuration
passportConfig(passport);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 minutes
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
    rolling: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", googleRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/availability", availabilityRoutes);

// Fetch uploaded files
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Error handler middleware
app.use(errorHandler);

export default app;
