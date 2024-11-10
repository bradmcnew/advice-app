import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAvailability } from "../../features/availability/availabilitySlice";
import "../../styles/Availability.css";

const DAYS_OF_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const DEFAULT_SLOTS = DAYS_OF_WEEK.map((day) => ({
  day_of_week: day,
  start_time: "",
  end_time: "",
}));

const AvailabilityForm = ({ existingAvailability }) => {
  const dispatch = useDispatch();
  const [availabilitySlots, setAvailabilitySlots] = useState(DEFAULT_SLOTS);

  useEffect(() => {
    if (
      Array.isArray(existingAvailability) &&
      existingAvailability.length > 0
    ) {
      const availabilityMap = existingAvailability.reduce((acc, slot) => {
        acc[slot.day_of_week] = slot;
        return acc;
      }, {});

      const mergedSlots = DAYS_OF_WEEK.map((day) => ({
        day_of_week: day,
        start_time: availabilityMap[day]?.start_time || "",
        end_time: availabilityMap[day]?.end_time || "",
      }));

      setAvailabilitySlots(mergedSlots);
    }
  }, [existingAvailability]);

  const handleTimeChange = async (index, field, value) => {
    const updatedSlots = [...availabilitySlots];
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value + ":00", // Add seconds to match backend format
    };
    setAvailabilitySlots(updatedSlots);

    const validSlots = updatedSlots.filter(
      (slot) => slot.start_time && slot.end_time
    );
    if (validSlots.length > 0) {
      try {
        await dispatch(setAvailability(validSlots)).unwrap();
      } catch (err) {
        console.error("Failed to set availability:", err);
      }
    }
  };

  return (
    <div className="availability-form">
      <h3>Set Your Weekly Availability</h3>
      <div className="availability-slots">
        {availabilitySlots.map((slot, index) => (
          <div key={slot.day_of_week} className="availability-slot">
            <label className="day-label">
              {slot.day_of_week.charAt(0).toUpperCase() +
                slot.day_of_week.slice(1)}
            </label>
            <div className="time-inputs">
              <input
                type="time"
                value={slot.start_time?.slice(0, 5) || ""} // Remove seconds for display
                onChange={(e) =>
                  handleTimeChange(index, "start_time", e.target.value)
                }
                className="time-input"
              />
              <span>to</span>
              <input
                type="time"
                value={slot.end_time?.slice(0, 5) || ""} // Remove seconds for display
                onChange={(e) =>
                  handleTimeChange(index, "end_time", e.target.value)
                }
                className="time-input"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityForm;
