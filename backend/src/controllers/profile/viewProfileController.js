const { User, UserProfile, Skill } = require("../../models");

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
          attributes: ["name"], // fields needed from the Skill model
          through: { attributes: [] }, // exclude UserSkill join table fields
        },
      ],
    });

    // Check if the user profile exists
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // map skills into an array of skill names
    const skills = userProfile.skills.map((skill) => skill.name);

    // Send the user profile as a response
    const { role } = userProfile.User;
    let profileData = {
      username: userProfile.User.username,
      email: userProfile.User.email,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      bio: userProfile.bio,
      phone_number: userProfile.phone_number,
      location: userProfile.location,
      profile_picture: userProfile.profile_picture,
      social_media_links: userProfile.social_media_links,
      role,
    };

    console.log("Role:", role);

    if (role === "high_school") {
      profileData.message = "This is a high school user profile";
    } else if (role === "college_student") {
      profileData.message = "This is a college student user profile";
      profileData.resume = userProfile.resume;
      profileData.skills = userProfile.skills;
      profileData.availability = userProfile.availability;
      profileData.skills = skills;
    }

    console.log("API sent:", profileData);

    res.status(200).json(profileData);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { viewProfile };
