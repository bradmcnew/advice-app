const { body, validationResult } = require("express-validator");

// Define validation rules for uploading a resume
const resumeUploadValidationRules = () => [
  body("resume").custom((_, { req }) => {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    // Check file type
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("Invalid file type. Only PDF files are allowed");
    }

    // Check file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit");
    }
    return true;
  }),
];

module.exports = {
  resumeUploadValidationRules,
};
