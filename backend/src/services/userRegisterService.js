const { User } = require("../models");

const registerUser = async (userData) => {
  const { username, email, password, role } = userData;

  // Check if required fields are missing
  if (!username || !email || !password || !role) {
    return {
      success: false,
      message: "Missing required fields",
      statusCode: 400,
    };
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return {
      success: false,
      message: "User already exists",
      statusCode: 400,
    };
  }

  // Create a new user
  const newUser = await User.build({
    username,
    email,
    role,
  });

  // Set and hash the password
  await newUser.setPassword(password);

  // Save the user to the database
  await newUser.save();

  return {
    success: true,
    user: newUser,
    statusCode: 201,
  };
};

module.exports = { registerUser };
