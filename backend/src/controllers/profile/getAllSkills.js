const { Skill } = require("../../models");

const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({ attributes: ["name"] });
    const skillNames = skills.map((skill) => skill.name);
    res.status(200).json({ skillNames });
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAllSkills };
