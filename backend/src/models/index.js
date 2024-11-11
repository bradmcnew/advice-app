"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
require("dotenv").config();

// Import models explicitly
const UserModel = require("./user");
const UserProfileModel = require("./userProfile");
const SkillModel = require("./skill");
const UserSkillModel = require("./userSkill");
const UserAvailabilityModel = require("./userAvailability");
const CollegeStudentReviewModel = require("./studentReviews");

const db = {};

// Initialize Sequelize with either DATABASE_URL or config object
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: "postgres",
    logging: false,
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    logging: false,
  });
}

// Initialize models
const User = UserModel(sequelize);
const UserProfile = UserProfileModel(sequelize);
const Skill = SkillModel(sequelize);
const UserSkill = UserSkillModel(sequelize);
const UserAvailability = UserAvailabilityModel(sequelize);
const CollegeStudentReview = CollegeStudentReviewModel(sequelize);

// Add models to db object
db.User = User;
db.UserProfile = UserProfile;
db.Skill = Skill;
db.UserSkill = UserSkill;
db.UserAvailability = UserAvailability;
db.CollegeStudentReview = CollegeStudentReview;

// Define associations
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
  as: "availability",
  onDelete: "CASCADE",
});

UserAvailability.belongsTo(UserProfile, {
  foreignKey: "user_profile_id",
});

UserProfile.hasMany(CollegeStudentReview, {
  as: "given_reviews",
  foreignKey: "reviewer_profile_id",
  onDelete: "CASCADE",
});

UserProfile.hasMany(CollegeStudentReview, {
  as: "received_reviews",
  foreignKey: "reviewed_profile_id",
  onDelete: "CASCADE",
});

CollegeStudentReview.belongsTo(UserProfile, {
  as: "reviewer_profile",
  foreignKey: "reviewer_profile_id",
});

CollegeStudentReview.belongsTo(UserProfile, {
  as: "reviewed_profile",
  foreignKey: "reviewed_profile_id",
});

// Add sequelize instances to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
