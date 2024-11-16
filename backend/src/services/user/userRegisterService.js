import { User, UserProfile } from "../../models/index.js";

/**
 * Registers a new user with the provided data.
 *
 * This function performs validation checks, ensures that the user does not already exist,
 * hashes the password, and saves the user to the database.
 *
 * @param {Object} userData - The data of the user to register.
 * @param {string} userData.username - The username of the user.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The password of the user.
 * @param {string} userData.role - The role of the user (e.g., "high_school" or "college_student").
 * @returns {Promise<Object>} - A promise that resolves with the registration result.
 */
const registerUser = async (userData) => {
  const { username, email, password, role } = userData;

  // Check if all required fields are provided
  if (!username || !email || !password || !role) {
    return {
      success: false,
      message: "Missing required fields",
      statusCode: 400,
    };
  }

  // Check if the user already exists based on email
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return {
      success: false,
      message: "User already exists",
      statusCode: 400,
    };
  }

  // Create a new user instance
  const newUser = User.build({
    username,
    email,
    role,
  });

  // Set and hash the user's password
  await newUser.setPassword(password);

  // Save the user to the database
  await newUser.save();

  // Create corresponding user profile
  await UserProfile.create({
    user_id: newUser.id, // Link the profile to the user
    first_name: "", // Placeholder or default values, customize as needed
    last_name: "",
    bio: "",
    phone_number: "",
    location: "",
    profile_picture: "",
    social_media_links: {}, // Default as an empty object or specific format
    resume: "",
  });

  // Return success response with user data
  return {
    success: true,
    user: newUser,
    statusCode: 201,
  };
};

export { registerUser };
