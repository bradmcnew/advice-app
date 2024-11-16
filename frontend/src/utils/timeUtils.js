export const mergeTimeSlots = (slots) => {
  console.log("Initial slots:", slots);

  if (!slots || slots.length === 0) return [];

  // Sort slots by day and start time
  const sortedSlots = [...slots].sort((a, b) => {
    if (a.day_of_week !== b.day_of_week) {
      return a.day_of_week.localeCompare(b.day_of_week);
    }
    return a.start_time.localeCompare(b.start_time);
  });

  console.log("Sorted slots:", sortedSlots);

  const mergedSlots = [];
  let currentSlot = null;

  for (const slot of sortedSlots) {
    if (!currentSlot) {
      currentSlot = { ...slot };
      continue;
    }

    console.log("Current slot:", currentSlot);
    console.log("Comparing with:", slot);
    console.log(
      "Are consecutive?",
      currentSlot.day_of_week === slot.day_of_week &&
        currentSlot.end_time === slot.start_time
    );

    if (
      currentSlot.day_of_week === slot.day_of_week &&
      currentSlot.end_time === slot.start_time
    ) {
      currentSlot.end_time = slot.end_time;
      console.log("Merged into:", currentSlot);
    } else {
      mergedSlots.push({ ...currentSlot });
      currentSlot = { ...slot };
    }
  }

  if (currentSlot) {
    mergedSlots.push({ ...currentSlot });
  }

  console.log("Final merged slots:", mergedSlots);
  return mergedSlots;
};
