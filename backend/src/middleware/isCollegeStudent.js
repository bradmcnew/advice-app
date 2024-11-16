import { User } from "../models/index.js";

// Middleware to check if the user is a college student
const isCollegeStudent = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "college_student") {
      return next();
    }

    return res
      .status(403)
      .json({ message: "Access denied: Not a college student." });
  } catch (err) {
    console.error("Error checking user role:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { isCollegeStudent };
