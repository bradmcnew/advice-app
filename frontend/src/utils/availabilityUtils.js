export const formatTime = (timeString) => {
  if (!timeString) return "";
  try {
    const time = new Date(`1970-01-01T${timeString}Z`);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeString;
  }
};

export const formatTimeForServer = (timeString) => {
  return `${timeString}:00`;
};

export const groupAvailabilityByDay = (availability) => {
  if (!Array.isArray(availability)) return {};

  // First group by day
  const groupedByDay = availability.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = [];
    }
    acc[slot.day_of_week].push({
      start: slot.start_time,
      end: slot.end_time,
    });
    return acc;
  }, {});

  // For each day, combine consecutive slots
  Object.keys(groupedByDay).forEach((day) => {
    // Sort slots by start time
    const slots = groupedByDay[day].sort((a, b) =>
      a.start.localeCompare(b.start)
    );
    const combinedSlots = [];
    let currentSlot = slots[0];

    for (let i = 1; i < slots.length; i++) {
      if (currentSlot.end === slots[i].start) {
        // Slots are consecutive, combine them
        currentSlot = {
          start: currentSlot.start,
          end: slots[i].end,
        };
      } else {
        // Slots are not consecutive, add current slot and start a new one
        combinedSlots.push(currentSlot);
        currentSlot = slots[i];
      }
    }
    // Add the last slot
    if (currentSlot) {
      combinedSlots.push(currentSlot);
    }

    groupedByDay[day] = combinedSlots;
  });

  return groupedByDay;
};
