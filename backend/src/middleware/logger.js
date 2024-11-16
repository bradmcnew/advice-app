import winston from "winston";

// Configure winston
const logger = winston.createLogger({
  level: "info", // Set the default log level
  format: winston.format.combine(
    winston.format.colorize(), // Add color to log messages
    winston.format.timestamp(), // Add timestamps to log messages
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`; // Custom log format
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to console
  ],
});

// Export the logger for use in other modules
export default logger;
