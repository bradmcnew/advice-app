const { UserProfile, Skill, UserSkill } = require("../../models");

const manageSkills = async (req, res, nect) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an array of skills" });
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
      skills.map(async (skillName) => {
        const [skill] = await Skill.findOrCreate({
          where: { name: skillName },
        });
        return skill;
      })
    );

    // update the user's skills via the UserSkills junction table
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

module.exports = { manageSkills };
