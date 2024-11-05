const { UserProfile, Skill, User } = require("../../models");

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
      social_media_links, // JSON object
      resume,
      skills, // array of skill names
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
        availability,
      });
    }

    // update or create skills and link them to the user profile
    if (skills && skills.length > 0) {
      const existingSkills = await Skill.findAll({
        where: { name: skills },
      });
      const existingSkillNames = existingSkills.map((skill) => skill.name);
      const newSkills = skills
        .filter((skill) => !existingSkillNames.includes(skill))
        .map((name) => ({ name }));

      await Skill.bulkCreate(newSkills, { ignoreDuplicates: true });

      const allSkills = await Skill.findAll({
        where: { name: skills },
      });

      await userProfile.setSkills(allSkills);
    }

    const updatedProfile = await UserProfile.findByPk(userProfile.id, {
      include: [
        { model: Skill, attributes: ["name"], through: { attributes: [] } },
        { model: User, attributes: ["username", "email", "role"] },
      ],
    });

    console.log("Updated profile:", updatedProfile);

    // If profile was created, return success message
    res.status(201).json({
      message: created
        ? "User profile created successfully"
        : "User profile updated successfully",
      user_profile: updatedProfile,
    });
  } catch (err) {
    console.error("Error updating or creating user profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { editProfile };
