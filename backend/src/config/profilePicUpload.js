const multer = require("multer");
const path = require("path");

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

module.exports = upload;
