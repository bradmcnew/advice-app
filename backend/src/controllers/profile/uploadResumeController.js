// Import necessary modules using ES6 import syntax
import { UserProfile } from "../../models/index.js";
import { getUserOldResumePath } from "../../services/profile/uploadProfilePicService.js";
import path from "path";
import { promises as fs } from "fs";

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

// Export the controller function using ES6 export syntax
export { uploadResume };
