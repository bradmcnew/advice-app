import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class UserAvailability extends Model {
    static associate(models) {
      UserAvailability.belongsTo(models.UserProfile, {
        foreignKey: "user_profile_id",
      });
    }
  }

  UserAvailability.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user_profiles",
          key: "id",
        },
        onDelete: "CASCADE",
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
      sequelize,
      modelName: "UserAvailability",
      tableName: "user_availability",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["user_profile_id", "day_of_week"],
        },
      ],
    }
  );

  return UserAvailability;
};
