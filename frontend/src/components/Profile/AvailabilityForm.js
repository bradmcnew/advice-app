/**
 * Component for managing user availability schedule
 * @module AvailabilityForm
 */

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAvailability } from "../../features/availability/availabilitySlice";
import { fetchProfile } from "../../features/profile/profileSlice";
import "../../styles/Availability.css";

/** @constant {string[]} Days of the week for availability slots */
const DAYS_OF_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/** @constant {Object[]} Default availability slots structure */
const DEFAULT_SLOTS = DAYS_OF_WEEK.map((day) => ({
  day_of_week: day,
  sessions: [{ start_time: "", end_time: "" }],
}));

/**
 * AvailabilityForm component
 * @param {Object} props - Component props
 * @param {Array} props.existingAvailability - Existing availability data
 * @param {Function} props.onChange - Callback when availability changes
 * @returns {JSX.Element} Rendered component
 */
const AvailabilityForm = ({ existingAvailability, onChange }) => {
  const dispatch = useDispatch();
  const [availabilitySlots, setAvailabilitySlots] = useState(DEFAULT_SLOTS);

  // Initialize form with existing availability data
  useEffect(() => {
    if (
      Array.isArray(existingAvailability) &&
      existingAvailability.length > 0
    ) {
      // Group sessions by day for easier management
      const groupedSessions = existingAvailability.reduce((acc, slot) => {
        if (!acc[slot.day_of_week]) {
          acc[slot.day_of_week] = [];
        }
        acc[slot.day_of_week].push({
          start_time: slot.start_time,
          end_time: slot.end_time,
        });
        return acc;
      }, {});

      // Create merged slots with all sessions for each day
      const mergedSlots = DAYS_OF_WEEK.map((day) => ({
        day_of_week: day,
        sessions:
          groupedSessions[day]?.length > 0
            ? groupedSessions[day]
            : [{ start_time: "", end_time: "" }],
      }));

      setAvailabilitySlots(mergedSlots);
    }
  }, [existingAvailability]);

  /**
   * Handle time input changes
   * @param {number} dayIndex - Index of the day being modified
   * @param {number} sessionIndex - Index of the session being modified
   * @param {string} field - Field being modified (start_time or end_time)
   * @param {string} value - New time value
   */
  const handleTimeChange = (dayIndex, sessionIndex, field, value) => {
    // Just update local state
    const updatedSlots = [...availabilitySlots];
    updatedSlots[dayIndex].sessions[sessionIndex][field] = value + ":00";
    setAvailabilitySlots(updatedSlots);

    // Notify parent component of changes
    const flattenedSlots = getFlattenedSlots(updatedSlots);
    onChange(flattenedSlots);
  };

  // Helper function to get flattened slots
  const getFlattenedSlots = (slots) => {
    return slots.flatMap((daySlot) =>
      daySlot.sessions
        .filter((session) => session.start_time && session.end_time)
        .map((session) => ({
          day_of_week: daySlot.day_of_week,
          start_time: session.start_time,
          end_time: session.end_time,
        }))
    );
  };

  const addSession = (dayIndex) => {
    const updatedSlots = [...availabilitySlots];
    updatedSlots[dayIndex].sessions.push({ start_time: "", end_time: "" });
    setAvailabilitySlots(updatedSlots);
    onChange(getFlattenedSlots(updatedSlots));
  };

  const removeSession = (dayIndex, sessionIndex) => {
    const updatedSlots = [...availabilitySlots];
    updatedSlots[dayIndex].sessions.splice(sessionIndex, 1);
    if (updatedSlots[dayIndex].sessions.length === 0) {
      updatedSlots[dayIndex].sessions.push({ start_time: "", end_time: "" });
    }
    setAvailabilitySlots(updatedSlots);
    onChange(getFlattenedSlots(updatedSlots));
  };

  return (
    <div className="availability-form">
      <h3>Set Your Weekly Availability</h3>
      <div className="availability-slots">
        {availabilitySlots.map((daySlot, dayIndex) => (
          <div key={daySlot.day_of_week} className="day-slot">
            <label className="day-label">
              {daySlot.day_of_week.charAt(0).toUpperCase() +
                daySlot.day_of_week.slice(1)}
            </label>
            <div className="sessions">
              {daySlot.sessions.map((session, sessionIndex) => (
                <div key={sessionIndex} className="time-slot">
                  <div className="time-inputs">
                    <input
                      type="time"
                      value={session.start_time?.slice(0, 5) || ""}
                      onChange={(e) =>
                        handleTimeChange(
                          dayIndex,
                          sessionIndex,
                          "start_time",
                          e.target.value
                        )
                      }
                      className="time-input"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={session.end_time?.slice(0, 5) || ""}
                      onChange={(e) =>
                        handleTimeChange(
                          dayIndex,
                          sessionIndex,
                          "end_time",
                          e.target.value
                        )
                      }
                      className="time-input"
                    />
                    {daySlot.sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSession(dayIndex, sessionIndex)}
                        className="remove-session-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSession(dayIndex)}
                className="add-session-btn"
              >
                + Add Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityForm;
