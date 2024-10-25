const { UserAvailability, UserProfile, sequelize } = require("../../models");

const setAvailability = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { availability } = req.body;

    console.log("1. Received request:", {
      userId,
      availability,
    });

    if (!availability || !Array.isArray(availability)) {
      return res.status(400).json({
        message:
          "Invalid request body. Expected an array of availability objects.",
        received: req.body,
      });
    }

    // Find the user's profile
    const userProfile = await UserProfile.findOne({
      where: { user_id: userId },
      attributes: ["id"], // Only fetch the id
    });

    console.log("2. Found user profile:", userProfile?.toJSON());

    if (!userProfile) {
      return res.status(404).json({
        message: "User profile not found",
        userId,
      });
    }

    // Delete existing availability entries for this user
    await UserAvailability.destroy({
      where: { user_profile_id: userProfile.id },
    });

    console.log(
      "3. Preparing availability records for user profile:",
      userProfile.id
    );

    // Create new availability records
    const availabilityRecords = availability.map((slot) => ({
      user_profile_id: userProfile.id,
      day_of_week: slot.day_of_week.toLowerCase(), // Ensure lowercase
      start_time: slot.start_time,
      end_time: slot.end_time,
    }));

    console.log("4. Created availability records:", availabilityRecords);

    // Create all records
    const createdAvailabilities = await UserAvailability.bulkCreate(
      availabilityRecords,
      {
        validate: true,
        returning: true,
        transaction,
      }
    );

    await transaction.commit();

    console.log("5. Successfully created availability records");

    return res.status(201).json({
      message: "Availability created successfully.",
      data: createdAvailabilities,
    });
  } catch (err) {
    console.error("Error in setAvailability:", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      message: "Failed to set availability",
      error: err.message,
    });
  }
};

// Controller to update availability for a user
const updateAvailability = async (req, res, next) => {
  const { availability_id } = req.params;
  console.log("availability_id", availability_id);
  const { start_time, end_time } = req.body;

  try {
    // Find the availability to update
    const availability = await UserAvailability.findOne({
      where: {
        id: availability_id,
      },
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    if (start_time !== undefined) {
      availability.start_time = start_time;
    }

    if (end_time !== undefined) {
      availability.end_time = end_time;
    }

    await availability.save();

    return res.status(200).json({
      message: "Availability updated successfully.",
      data: availability,
    });
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ message: "Failed to update availability" });
  }
};

// Controller to fetch availability for a user
const getAvailability = async (req, res, next) => {
  const { user_profile_id } = req.params;
  console.log("user_profile_id", user_profile_id);

  try {
    // Find availability for the user
    const availability = await UserAvailability.findAll({
      where: { user_profile_id: user_profile_id },
    });

    if (!availability.length) {
      return res.status(404).json({ message: "Availability not found" });
    }

    return res.status(200).json({
      message: "Availability fetched successfully.",
      data: availability,
    });
  } catch (err) {
    console.error("Error fetching availability:", err);
    res.status(500).json({ message: "Failed to fetch availability" });
  }
};

module.exports = { setAvailability, updateAvailability, getAvailability };
