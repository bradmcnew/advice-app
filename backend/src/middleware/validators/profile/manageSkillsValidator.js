import { body } from "express-validator";

// Validation rules for managing skills
const skillsValidationRules = () => [
  // Validate the skills array
  body("skills")
    .isArray({ min: 1 })
    .withMessage("Please provide an array of skills")
    .bail()
    .custom((skills) => {
      const allStrings = skills.every(
        (skill) => typeof skill === "string" && skill.trim().length > 0
      );
      if (!allStrings) {
        throw new Error("Each skill must be a non-empty string");
      }
      return true;
    }),
];

export { skillsValidationRules };
