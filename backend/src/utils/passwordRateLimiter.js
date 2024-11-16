import rateLimit from "express-rate-limit";

const passwordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: 429,
    message: "Too many password reset attempts. Please try again later.",
  },
});

export default passwordRateLimiter;
