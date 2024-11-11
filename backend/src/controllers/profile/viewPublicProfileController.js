const { UserProfile, User, Skill, UserAvailability } = require("../../models");

const viewPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Viewing public profile:", id);

    // Fetch user's public profile by profile_id
    const profile = await UserProfile.findOne({
      where: { id: id },
      include: [
        {
          model: User,
          attributes: ["role"],
        },
        {
          model: Skill,
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: UserAvailability,
          as: "availability",
          attributes: ["id", "day_of_week", "start_time", "end_time"],
          raw: false,
          nest: true,
        },
      ],
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
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const publicProfile = {
      ...profile.toJSON(),
      role: profile.User?.role,
      skills: profile.Skills?.map((skill) => skill.name) || [],
      social_media_links: profile.social_media_links || {},
    };

    delete publicProfile.User;
    delete publicProfile.Skills;
    delete publicProfile.UserAvailabilities;

    console.log("API sending profile:", profile);

    // Send the retrieved profile data
    return res.status(200).json({
      success: true,
      message: "Profile found",
      profile: profile,
    });
  } catch (err) {
    console.error("Error viewing public profile:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
      error: err.message,
    });
  }
};

module.exports = { viewPublicProfile };
