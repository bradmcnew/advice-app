// models/collegeStudentReview.js
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class CollegeStudentReview extends Model {
    static associate(models) {
      // CollegeStudentReview belongs to the reviewer profile
      CollegeStudentReview.belongsTo(models.UserProfile, {
        as: "reviewer_profile",
        foreignKey: "reviewer_profile_id",
        onDelete: "CASCADE",
      });

      // CollegeStudentReview belongs to the reviewed profile
      CollegeStudentReview.belongsTo(models.UserProfile, {
        as: "reviewed_profile",
        foreignKey: "reviewed_profile_id",
        onDelete: "CASCADE",
      });
    }
  }

  CollegeStudentReview.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reviewer_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user_profiles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      reviewed_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user_profiles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      review_text: {
        type: DataTypes.TEXT,
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
      modelName: "CollegeStudentReview",
      tableName: "college_student_reviews",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return CollegeStudentReview;
};
