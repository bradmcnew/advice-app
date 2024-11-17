// Import necessary models using ES6 import syntax
import {
  UserAvailability,
  UserProfile,
  sequelize,
} from "../../models/index.js";

/**
 * Controller to set availability for a user.
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object to send responses to the client.
 * @param {Function} next - The next middleware function for error handling.
 */
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

    // Validate and deduplicate time slots
    const validatedSlots = new Map();
    const overlappingErrors = [];

    // Sort availability by day and start time
    const sortedAvailability = [...availability].sort((a, b) => {
      if (a.day_of_week !== b.day_of_week) {
        return a.day_of_week.localeCompare(b.day_of_week);
      }
      return a.start_time.localeCompare(b.start_time);
    });

    for (const slot of sortedAvailability) {
      const slotKey = `${slot.day_of_week}-${slot.start_time}-${slot.end_time}`;
      const timeStart = new Date(`1970-01-01T${slot.start_time}Z`);
      const timeEnd = new Date(`1970-01-01T${slot.end_time}Z`);

      // Check for exact duplicates
      if (validatedSlots.has(slotKey)) {
        overlappingErrors.push(
          `Duplicate slot: ${slot.day_of_week} ${slot.start_time}-${slot.end_time}`
        );
        continue;
      }

      // Check for overlapping times within the same day
      let hasOverlap = false;
      validatedSlots.forEach((existingSlot) => {
        if (existingSlot.day_of_week === slot.day_of_week) {
          const existingStart = new Date(
            `1970-01-01T${existingSlot.start_time}Z`
          );
          const existingEnd = new Date(`1970-01-01T${existingSlot.end_time}Z`);

          // Two time slots overlap if one starts before the other ends
          // and the other starts before the first one ends
          if (timeStart < existingEnd && existingStart < timeEnd) {
            hasOverlap = true;
            overlappingErrors.push(
              `Time slot overlap on ${slot.day_of_week}: ${existingSlot.start_time}-${existingSlot.end_time} and ${slot.start_time}-${slot.end_time}`
            );
          }
        }
      });

      if (!hasOverlap) {
        validatedSlots.set(slotKey, slot);
      }
    }

    // If there are any overlapping errors, return them
    if (overlappingErrors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Invalid availability slots detected",
        errors: overlappingErrors,
      });
    }

    // Delete existing availability
    await UserAvailability.destroy({
      where: { user_profile_id: userProfile.id },
      transaction,
    });

    // Create new availability entries from validated slots
    const availabilityEntries = Array.from(validatedSlots.values()).map(
      (slot) => ({
        user_profile_id: userProfile.id,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
      })
    );

    await UserAvailability.bulkCreate(availabilityEntries, { transaction });

    await transaction.commit();

    // Fetch and return the updated availability
    const updatedAvailability = await UserAvailability.findAll({
      where: { user_profile_id: userProfile.id },
      order: [
        ["day_of_week", "ASC"],
        ["start_time", "ASC"],
      ],
    });

    return res.status(200).json({
      message: "Availability set successfully",
      data: updatedAvailability,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error setting availability:", error);
    return res.status(500).json({
      message: "Failed to set availability",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Controller to update availability for a user.
 * @param {Object} req - The request object containing the updated data.
 * @param {Object} res - The response object to send responses to the client.
 */
const updateAvailability = async (req, res) => {
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

/**
 * Controller to fetch availability for a user.
 * @param {Object} req - The request object containing the user profile ID.
 * @param {Object} res - The response object to send responses to the client.
 */
const getAvailability = async (req, res) => {
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

// Export controller functions using ES6 export syntax
export { setAvailability, updateAvailability, getAvailability };
