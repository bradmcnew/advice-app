import { body } from "express-validator";

// Define validation rules for profile updates
const profileValidationRules = () => {
  return [
    // Validate and sanitize bio (optional)
    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio must not exceed 500 characters")
      .trim()
      .escape(),

    // Validate and sanitize phone_number (optional)
    body("phone_number")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number format")
      .trim(),

    // Validate and sanitize location (optional)
    body("location")
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage("Location must not exceed 100 characters")
      .trim(),

    // Validate profile_picture (optional, must be a valid URL)
    body("profile_picture")
      .optional({ nullable: true, checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL for profile picture")
      .trim(),

    // Validate social_media_links (optional, must be a valid JSON object or string)
    body("social_media_links")
      .optional()
      .custom((value) => {
        // Try parsing if it's a string
        if (typeof value === "string") {
          try {
            value = JSON.parse(value);
          } catch (e) {
            throw new Error("Social media links must be a valid JSON object");
          }
        }
        // Ensure it's a valid object
        if (typeof value !== "object" || Array.isArray(value)) {
          throw new Error("Social media links must be a valid JSON object");
        }
        // Ensure each key is a valid URL
        const valid = Object.values(value).every((url) =>
          /^(https?:\/\/)/.test(url)
        );
        if (!valid) {
          throw new Error("Each social media link must be a valid URL");
        }
        return true;
      }),

    // Validate skills (optional, must be an array of strings or stringified array)
    body("skills")
      .optional()
      .custom((value) => {
        // Try parsing if it's a string
        if (typeof value === "string") {
          try {
            value = JSON.parse(value);
          } catch (e) {
            throw new Error("Skills must be a valid array");
          }
        }
        // Ensure it's a valid array
        if (!Array.isArray(value)) {
          throw new Error("Skills must be an array");
        }
        // Ensure every item in the array is a string
        if (!value.every((skill) => typeof skill === "string")) {
          throw new Error("Each skill must be a string");
        }
        return true;
      }),

    // Validate availability (optional, must be a string)
    body("availability")
      .optional()
      .isString()
      .isLength({ max: 50 })
      .withMessage("Availability must not exceed 50 characters")
      .trim(),
  ];
};

export { profileValidationRules };
