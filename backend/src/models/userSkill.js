import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class UserSkill extends Model {
    static associate(models) {
      // Through table typically doesn't need associations
    }
  }

  UserSkill.init(
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
      skill_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "skills",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "UserSkill",
      tableName: "user_skills",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return UserSkill;
};
