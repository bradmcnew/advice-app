"use strict";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { Sequelize } from "sequelize";
import process from "process";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || "development";
console.log("Environment:", env);
const config = (await import(__dirname + "/../config/config.js")).default[env];
console.log("Selected config:", config);

// Import models explicitly
import UserModel from "./user.js";
import UserProfileModel from "./userProfile.js";
import SkillModel from "./skill.js";
import UserSkillModel from "./userSkill.js";
import UserAvailabilityModel from "./userAvailability.js";
import CollegeStudentReviewModel from "./studentReviews.js";
import BookingModel from "./booking.js";

const db = {};

// Initialize Sequelize
let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logging: false,
  }
);

// Initialize models
const models = {
  User: UserModel(sequelize),
  UserProfile: UserProfileModel(sequelize),
  Skill: SkillModel(sequelize),
  UserSkill: UserSkillModel(sequelize),
  UserAvailability: UserAvailabilityModel(sequelize),
  CollegeStudentReview: CollegeStudentReviewModel(sequelize),
  Booking: BookingModel(sequelize),
};

// Run associations
Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

export const {
  User,
  UserProfile,
  Skill,
  UserSkill,
  UserAvailability,
  CollegeStudentReview,
  Booking,
} = models;

export { sequelize };
