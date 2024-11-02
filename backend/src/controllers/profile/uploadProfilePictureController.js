const { UserProfile } = require("../../models");
const path = require("path");
const {
  getUserOldProfilePicturePath,
} = require("../../services/profile/uploadProfilePicService");
const fs = require("fs").promises;

// Controller to upload a user's profile picture
const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file chosen" });
    }

    const userId = req.user.id;

    // File path (full url if needed)
    const profilePicturePath = `/uploads/profilePics/${req.file.filename}`;

    // Find or create the user profile
    const [userProfile, created] = await UserProfile.findOrCreate({
      where: { user_id: userId },
    });

    const oldProfilePicturePath = await getUserOldProfilePicturePath(userId);

    // Delete the old profile picture if it exists
    if (oldProfilePicturePath) {
      const fullPath = path.join(__dirname, "../../", oldProfilePicturePath);

      try {
        await fs.unlink(fullPath);
        console.log("Old profile picture deleted successfully");
      } catch (err) {
        console.error("Error deleting old profile picture:", err);
      }
    } else {
      console.log("No old profile picture found");
    }

    // Update the profile with the file path
    await userProfile.update({
      profile_picture: profilePicturePath,
    });

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profile_picture: profilePicturePath,
    });
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { uploadProfilePicture };
