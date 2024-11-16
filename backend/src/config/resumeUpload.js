import multer from "multer";
import path from "path";

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/resumes")); // Change this to your desired upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.random().toString(36).substring(2, 15);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Set file filter for resumes (only allow certain file types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error("Error: Only .pdf, .doc, and .docx format allowed!"));
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

export default upload;
