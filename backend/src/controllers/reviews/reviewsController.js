const { UserProfile, CollegeStudentReview } = require("../../models");

const getReviewsForUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    // Fetch user profile along with reviews received by the user
    const profile = await UserProfile.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CollegeStudentReview,
          as: "received_reviews",
          attributes: ["id", "rating", "review_text", "created_at"],
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      userId,
      receivedReviews: profile.received_reviews,
    });
  } catch (err) {
    console.error("Error fetching reviews for user:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

module.exports = { getReviewsForUser };
