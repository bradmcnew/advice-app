import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, {
        foreignKey: "user_id",
      });

      UserProfile.belongsToMany(models.Skill, {
        through: models.UserSkill,
        foreignKey: "user_profile_id",
        otherKey: "skill_id",
      });

      UserProfile.hasMany(models.UserAvailability, {
        foreignKey: "user_profile_id",
        as: "availability",
        onDelete: "CASCADE",
      });

      UserProfile.hasMany(models.CollegeStudentReview, {
        as: "given_reviews",
        foreignKey: "reviewer_profile_id",
        onDelete: "CASCADE",
      });

      UserProfile.hasMany(models.CollegeStudentReview, {
        as: "received_reviews",
        foreignKey: "reviewed_profile_id",
        onDelete: "CASCADE",
      });
    }
  }

  UserProfile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      social_media_links: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      resume: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserProfile",
      tableName: "user_profiles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return UserProfile;
};
