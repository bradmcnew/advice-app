// Import necessary models using ES6 import syntax
import {
  UserProfile,
  Skill,
  User,
  UserAvailability,
} from "../../models/index.js";

/**
 * Controller to edit or create a user's profile.
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object to send responses to the client.
 * @param {Function} next - The next middleware function for error handling.
 */
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

    // Update or create skills and link them to the user profile
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

    // Fetch updated profile with skills and user details
    const updatedProfile = await UserProfile.findByPk(userProfile.id, {
      include: [
        { model: Skill, attributes: ["name"], through: { attributes: [] } },
        { model: User, attributes: ["username", "email", "role"] },
        {
          model: UserAvailability,
          as: "availability",
          attributes: ["id", "day_of_week", "start_time", "end_time"],
        },
      ],
    });

    // Sort and organize availability before sending
    if (updatedProfile.availability) {
      updatedProfile.availability = updatedProfile.availability.sort((a, b) => {
        if (a.day_of_week !== b.day_of_week) {
          return a.day_of_week.localeCompare(b.day_of_week);
        }
        return a.start_time.localeCompare(b.start_time);
      });
    }

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

// Export the controller function using ES6 export syntax
export { editProfile };
