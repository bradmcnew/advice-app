"use strict";

const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, you might want to get some existing user_profile IDs
    const userProfiles = await queryInterface.sequelize.query(
      "SELECT id FROM user_profiles LIMIT 10;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Create sample reviews
    const reviews = [];
    for (let i = 0; i < userProfiles.length - 1; i++) {
      reviews.push({
        id: uuidv4(),
        reviewer_profile_id: userProfiles[i].id,
        reviewed_profile_id: userProfiles[i + 1].id,
        rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
        review_text: `This is a sample review ${
          i + 1
        }. Great experience working together!`,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("college_student_reviews", reviews, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("college_student_reviews", null, {});
  },
};
