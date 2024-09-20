const { Sequelize } = require("sequelize");
const UserModel = require("./user"); // Import the User model
require("dotenv").config(); // Load environment variables from .env file

// Determine the environment (development, test, etc.)
const env = process.env.NODE_ENV || "development";

// Connect to the PostgreSQL database using Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres", // Specify the database dialect
  logging: false, // Disable logging of SQL queries
});

// Initialize the User model
const User = UserModel(sequelize);

// Function to synchronize models with the database
const syncDatabase = async () => {
  try {
    // Options to determine sync behavior based on the environment
    const options = env === "test" ? { force: true } : { alter: true };
    await sequelize.sync(options); // Synchronize models with the database
    console.log("Database and tables have been created or updated.");
  } catch (error) {
    // Log any errors that occur during synchronization
    console.error("Failed to sync database:", error);
  }
};

// Sync the database if not in test environment
if (env !== "test") {
  syncDatabase();
}

// Export the sequelize instance and models for use in other parts of the application
module.exports = { sequelize, User };
