"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_availability", {
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
      day_of_week: {
        type: Sequelize.ENUM(
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"
        ),
        allowNull: false,
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
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

    // Add index
    try {
      await queryInterface.addIndex(
        "user_availability",
        ["user_profile_id", "day_of_week"],
        {
          name: "user_availability_user_profile_id_day_of_week",
        }
      );
    } catch (error) {
      console.log("Index already exists, skipping creation");
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex(
        "user_availability",
        "user_availability_user_profile_id_day_of_week"
      );
    } catch (error) {
      console.log("Index does not exist, skipping removal");
    }
    await queryInterface.dropTable("user_availability");
  },
};
