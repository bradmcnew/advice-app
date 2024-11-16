"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_skills", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user_profiles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      skill_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "skills",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_skills");
  },
};
