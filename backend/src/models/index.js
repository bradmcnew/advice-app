const { Sequelize } = require("sequelize");
const UserModel = require("./user"); // Import the User model
const UserProfileModel = require("./userProfile"); // Import the UserProfile model
const SkillModel = require("./skill");
const UserSkillModel = require("./userSkill");
const UserAvailabilityModel = require("./userAvailability");
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
// Initialize the UserProfile model
const UserProfile = UserProfileModel(sequelize);
const Skill = SkillModel(sequelize);
const UserSkill = UserSkillModel(sequelize);
const UserAvailability = UserAvailabilityModel(sequelize);

// Establish association: User has one Profile, Profile belongs to User
User.hasOne(UserProfile, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
UserProfile.belongsTo(User, {
  foreignKey: "user_id",
});
UserProfile.belongsToMany(Skill, {
  through: UserSkill,
  foreignKey: "user_profile_id",
  otherKey: "skill_id",
});
Skill.belongsToMany(UserProfile, {
  through: UserSkill,
  foreignKey: "skill_id",
  otherKey: "user_profile_id",
});
UserProfile.hasMany(UserAvailability, {
  foreignKey: "user_profile_id",
  onDelete: "CASCADE",
});
UserAvailability.belongsTo(UserProfile, {
  foreignKey: "user_profile_id",
});

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
module.exports = {
  sequelize,
  User,
  UserProfile,
  Skill,
  UserSkill,
  UserAvailability,
};
