const { UserProfile } = require("../../models");

const viewPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Viewing public profile:", id);

    // Fetch user's public profile by profile_id
    const profile = await UserProfile.findOne({
      where: { id: id },
      attributes: [
        "first_name",
        "last_name",
        "bio",
        "location",
        "profile_picture",
        "social_media_links",
      ],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Send the retrieved profile data
    return res.status(200).json({
      message: "Profile found",
      profile: profile,
    });
  } catch (err) {
    console.error("Error viewing public profile:", err);
    return res.status(500).json({
      message: "Failed to retrieve profile",
      error: err.message,
    });
  }
};

module.exports = { viewPublicProfile };
