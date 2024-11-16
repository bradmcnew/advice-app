import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

// Function to clean up old profile picture
const cleanupOldProfilePic = async (oldPicPath) => {
  if (!oldPicPath) {
    return;
  }

  try {
    const fullPath = path.join(__dirname, "../", oldPicPath);
    await fs.unlink(fullPath);
    console.log("Old profile picture deleted successfully");
  } catch (err) {
    console.error("Error deleting old profile picture:", err);
  }
};

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/profilePics")); // Save files to the uploads folder
  },
  filename: (req, file, cb) => {
    console.log("Original Filename:", file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter function to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only images are allowed!"), false); // Reject the file
  }
};

// Create the multer upload object
const upload = multer({ storage: storage, fileFilter: fileFilter });

export { upload, cleanupOldProfilePic };
