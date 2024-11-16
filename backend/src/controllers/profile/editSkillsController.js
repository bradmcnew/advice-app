// Import necessary models using ES6 import syntax
import { UserProfile, Skill, UserSkill } from "../../models/index.js";

/**
 * Controller to manage a user's skills (add, update).
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object to send responses to the client.
 * @param {Function} next - The next middleware function for error handling.
 */
const manageSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    // Normalize skills (trim and convert to lowercase)
    const cleanedSkills = skills
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean);

    if (cleanedSkills.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide valid skill names." });
    }

    // Get authenticated user's profile
    const userProfile = await UserProfile.findOne({
      where: { user_id: req.user.id },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Find or create the skills in the Skill model
    const skillInstances = await Promise.all(
      cleanedSkills.map(async (skillName) => {
        const [skill] = await Skill.findOrCreate({
          where: { name: skillName },
        });
        return skill;
      })
    );

    // Update the user's skills via the UserSkills junction table
    await userProfile.setSkills(skillInstances);

    res.status(200).json({
      message: "Skills updated successfully",
      skills: skillInstances.map((skill) => skill.name),
    });
  } catch (err) {
    console.error("Error updating skills:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Export the controller function using ES6 export syntax
export { manageSkills };
