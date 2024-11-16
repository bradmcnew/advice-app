import { body } from "express-validator";

// Define validation rules for profile picture upload
const profilePicUploadValidationRules = () => [
  body("profile_picture").custom((_, { req }) => {
    // Check if a file is uploaded
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("Invalid file type. Only JPEG and PNG files are allowed");
    }

    // Check file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit");
    }
    return true;
  }),
];

export { profilePicUploadValidationRules };
