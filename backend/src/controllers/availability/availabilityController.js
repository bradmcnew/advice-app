const { UserAvailability, UserProfile, sequelize } = require("../../models");

const setAvailability = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { availability } = req.body;

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
    });

    if (!userProfile) {
      await transaction.rollback();
      return res.status(404).json({ message: "User profile not found" });
    }

    // Delete existing availability
    await UserAvailability.destroy({
      where: { user_profile_id: userProfile.id },
      transaction,
    });

    // Create new availability entries
    const availabilityEntries = availability.map((slot) => ({
      user_profile_id: userProfile.id,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
    }));

    await UserAvailability.bulkCreate(availabilityEntries, { transaction });

    await transaction.commit();

    // Fetch and return the updated availability
    const updatedAvailability = await UserAvailability.findAll({
      where: { user_profile_id: userProfile.id },
    });

    return res.status(200).json({
      message: "Availability set successfully",
      data: updatedAvailability,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error setting availability:", error);
    return res.status(500).json({ message: "Failed to set availability" });
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
