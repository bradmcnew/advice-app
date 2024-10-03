const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; // Number of salt rounds for password hashing

module.exports = (sequelize) => {
  // Define the User model
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // Automatically increment the ID
        primaryKey: true, // Set this field as the primary key
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false, // Username cannot be null
        unique: true, // Username must be unique
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false, // Email cannot be null
        unique: true, // Email must be unique
        validate: {
          isEmail: true, // Validate that the input is a valid email format
        },
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true, // Password hash can be null
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: true, // Role can be null
        validate: {
          isIn: [["high_school", "college_student"]], // Validate that the role is either high_school or college_student
        },
      },
      reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true, // Reset token can be null
      },
      reset_token_expiration: {
        type: DataTypes.DATE,
        allowNull: true, // Reset token expiration can be null
      },
      google_id: {
        type: DataTypes.STRING,
        unique: true, // Ensure that googleId is unique
        allowNull: true, // Allow null for users who authenticate via other means
      },
      // No need to manually define createdAt or updatedAt here
    },
    {
      tableName: "users", // Set the table name in the database
      timestamps: true, // Enable automatic management of `createdAt` and `updatedAt`
      createdAt: "created_at", // Map `createdAt` to `created_at` column
      updatedAt: "updated_at", // Map `updatedAt` to `updated_at` column
    }
  );

  // Instance Methods for Password Hashing
  User.prototype.setPassword = async function (password) {
    // Hash the password using bcrypt and set it to password_hash
    this.password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  };

  User.prototype.validatePassword = async function (password) {
    // Compare the provided password with the stored password_hash
    return bcrypt.compare(password, this.password_hash);
  };

  return User; // Return the User model
};
