const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserSkills = sequelize.define(
    "user_skills",
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
      tableName: "user_skills",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return UserSkills;
};
