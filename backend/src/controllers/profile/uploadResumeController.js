const { UserProfile } = require("../../models");
const {
  getUserOldResumePath,
} = require("../../services/uploadProfilePicService");
const path = require("path");
const fs = require("fs").promises;

// Controller to upload a user's resume
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file chosen" });
    }

    const userId = req.user.id;

    const resumePath = `/uploads/resumes/${req.file.filename}`;

    // Find or create the user profile
    const [userProfile, created] = await UserProfile.findOrCreate({
      where: { user_id: userId },
      defaults: {
        resume: null,
      },
    });

    const oldResumePath = await getUserOldResumePath(userId);

    if (oldResumePath) {
      const fullPath = path.join(__dirname, "../../", oldResumePath);

      try {
        await fs.unlink(fullPath);
        console.log("Old resume deleted successfully");
      } catch (err) {
        console.error("Error deleting old resume:", err);
      }
    } else {
      console.log("No old resume found");
    }

    await userProfile.update({
      resume: resumePath,
    });

    res.status(200).json({
      message: "Resume uploaded successfully",
      resume: resumePath,
    });
  } catch (err) {
    console.error("Error uploading resume:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { uploadResume };
