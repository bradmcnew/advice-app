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
        allowNull: false, // Password hash cannot be null
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false, // Role cannot be null
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Set default value to current date/time
        field: "created_at", // Map to created_at column in the database
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Set default value to current date/time
        field: "updated_at", // Map to updated_at column in the database
      },
    },
    {
      tableName: "users", // Set the table name in the database
      timestamps: false, // Disable automatic timestamps since we are manually managing them
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
