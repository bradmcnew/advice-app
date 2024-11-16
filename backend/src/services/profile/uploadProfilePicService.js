import { UserProfile } from "../../models/index.js";

const getUserOldProfilePicturePath = async (userId) => {
  // Find or create the user profile
  const user = await UserProfile.findOne({
    where: { user_id: userId },
  });

  // Return the current profile picture path
  return user.profile_picture; // Return old profile picture path
};

const getUserOldResumePath = async (userId) => {
  // Find or create the user profile
  const user = await UserProfile.findOne({
    where: { user_id: userId },
  });

  // Return the current resume path
  return user.resume; // Return old resume path
};

export { getUserOldProfilePicturePath, getUserOldResumePath };
