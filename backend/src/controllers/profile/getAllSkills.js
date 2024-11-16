// Import Skill model using ES6 import syntax
import { Skill } from "../../models/index.js";

/**
 * Controller to fetch all skills from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllSkills = async (req, res) => {
  try {
    // Fetch skills from the database, selecting only the "name" attribute
    const skills = await Skill.findAll({ attributes: ["name"] });

    // Extract skill names
    const skillNames = skills.map((skill) => skill.name);

    // Send response with the skill names
    res.status(200).json({ skillNames });
  } catch (err) {
    // Handle errors and send an appropriate response
    console.error("Error fetching skills:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Export the controller function using ES6 export syntax
export { getAllSkills };
