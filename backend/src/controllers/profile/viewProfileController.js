import { User, UserProfile, Skill } from "../../models/index.js";

// Controller to view a user's profile
const viewProfile = async (req, res) => {
  try {
    // Fetch authenticated user's id
    const userId = req.user.id;

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: ["username", "email", "role"], // fields needed from the User model
        },
        {
          model: Skill,
          through: { attributes: [] }, // exclude junction table attributes
          attributes: ["id", "name"],
        },
      ],
      attributes: [
        "id",
        "first_name",
        "last_name",
        "bio",
        "phone_number",
        "location",
        "profile_picture",
        "social_media_links",
        "resume",
      ],
    });

    // Check if the user profile exists
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Create base profile data
    const profileData = {
      username: userProfile.User.username,
      email: userProfile.User.email,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      bio: userProfile.bio,
      phone_number: userProfile.phone_number,
      location: userProfile.location,
      profile_picture: userProfile.profile_picture,
      social_media_links: userProfile.social_media_links,
      role: userProfile.User.role,
      // Initialize skills as empty array by default
      skills: userProfile.Skills
        ? userProfile.Skills.map((skill) => skill.name)
        : [],
    };

    // Add role-specific data
    if (profileData.role === "college_student") {
      profileData.resume = userProfile.resume;
    }

    res.status(200).json(profileData);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export { viewProfile };
