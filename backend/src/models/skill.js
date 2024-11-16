// models/skill.js
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Skill extends Model {
    static associate(models) {
      Skill.belongsToMany(models.UserProfile, {
        through: models.UserSkill,
        foreignKey: "skill_id",
        otherKey: "user_profile_id",
      });
    }
  }

  Skill.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Skill",
      tableName: "skills",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Skill;
};
