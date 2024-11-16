import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserProfile, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }

    async setPassword(password) {
      this.password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    async validatePassword(password) {
      return bcrypt.compare(password, this.password_hash);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          isIn: [["high_school", "college_student"]],
        },
      },
      reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      reset_token_expiration: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      google_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
