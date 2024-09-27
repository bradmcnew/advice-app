const rateLimit = require("express-rate-limit");

const passwordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 3 requests per windowMs
  message: {
    status: 429,
    message: "Too many password reset attempts. Please try again later.",
  },
});

module.exports = passwordRateLimiter;
