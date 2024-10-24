const { UserProfile } = require("../models");

async function getUserOldProfilePicturePath(userId) {
  // Find or create the user profile
  const user = await UserProfile.findOne({
    where: { user_id: userId },
  });

  // Return the current profile picture path
  return user.profile_picture; // Return old profile picture path
}

async function getUserOldResumePath(userId) {
  // Find or create the user profile
  const user = await UserProfile.findOne({
    where: { user_id: userId },
  });

  // Return the current resume path
  return user.resume; // Return old resume path
}

module.exports = { getUserOldProfilePicturePath, getUserOldResumePath };
