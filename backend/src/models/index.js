const { Sequelize } = require("sequelize");
const UserModel = require("./user");
require("dotenv").config();

const env = process.env.NODE_ENV || "development";

// Connect to the database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// Initialize the User model
const User = UserModel(sequelize);
// Synchronize models
const syncDatabase = async () => {
  try {
    const options = env === "test" ? { force: true } : { alter: true };
    await sequelize.sync(options);
    console.log("Database and tables have been created or updated.");
  } catch (error) {
    console.error("Failed to sync database:", error);
  }
};

if (env !== "test") {
  syncDatabase();
}

// Export the sequelize object and models
module.exports = { sequelize, User };
