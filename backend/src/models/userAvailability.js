const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserAvailability = sequelize.define(
    "UserAvailability",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
        primaryKey: true,
      },
      user_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user_profiles", // Ensure the model name is correct (case-sensitive)
          key: "id",
        },
        onDelete: "CASCADE", // Ensures deletion of availability records when user profile is deleted
      },
      day_of_week: {
        type: DataTypes.ENUM(
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
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      tableName: "user_availability",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return UserAvailability;
};
