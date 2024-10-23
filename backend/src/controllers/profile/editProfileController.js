const { UserProfile } = require("../../models");

// Controller to edit or create a user's profile
const editProfile = async (req, res, next) => {
  try {
    // Fetch authenticated user's id
    const userId = req.user.id;

    const {
      first_name,
      last_name,
      bio,
      phone_number,
      location,
      profile_picture,
      social_media_links,
      resume,
      skills,
      availability,
    } = req.body;

    // Find or create the user profile
    const [userProfile, created] = await UserProfile.findOrCreate({
      where: { user_id: userId },
      defaults: {
        first_name,
        last_name,
        bio,
        phone_number,
        location,
        profile_picture,
        social_media_links,
        resume,
        skills,
        availability,
      },
    });

    // If profile already exists, update it
    if (!created) {
      await userProfile.update({
        first_name,
        last_name,
        bio,
        phone_number,
        location,
        profile_picture,
        social_media_links,
        resume,
        skills,
        availability,
      });

      return res.status(200).json({
        message: "User profile updated successfully",
        user_profile: userProfile,
      });
    }

    // If profile was created, return success message
    res.status(201).json({
      message: "User profile created successfully",
      user_profile: userProfile,
    });
  } catch (err) {
    console.error("Error updating or creating user profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { editProfile };
