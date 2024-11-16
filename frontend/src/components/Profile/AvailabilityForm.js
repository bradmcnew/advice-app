/**
 * Component for managing user availability schedule
 * @module AvailabilityForm
 */

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "../../styles/Availability.css";
import { mergeTimeSlots } from "../../utils/timeUtils";

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
 * Handles user availability slots for each day of the week.
 * Allows adding/removing session times for each day.
 * @param {Object} props - Component props
 * @param {Array} props.existingAvailability - Existing availability data
 * @param {Function} props.onChange - Callback when availability changes
 * @returns {JSX.Element} Rendered component
 */
const AvailabilityForm = ({ existingAvailability, onChange }) => {
  const [availabilitySlots, setAvailabilitySlots] = useState(DEFAULT_SLOTS);

  // Initialize form with existing availability data
  useEffect(() => {
    console.log("Existing availability in form:", existingAvailability);
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

  // Add this helper function to split time into 30-minute intervals
  const splitIntoThirtyMinIntervals = (startTime, endTime) => {
    const intervals = [];
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    let currentTime = start;
    while (currentTime < end) {
      const intervalStart = currentTime.toTimeString().slice(0, 8); // HH:MM:SS
      currentTime = new Date(currentTime.getTime() + 30 * 60000); // Add 30 minutes
      const intervalEnd = currentTime.toTimeString().slice(0, 8);

      intervals.push({
        start_time: intervalStart,
        end_time: intervalEnd,
      });
    }

    return intervals;
  };

  /**
   * Handle time input changes
   * Updates the availability slots state when a user modifies session times.
   * @param {number} dayIndex - Index of the day being modified
   * @param {number} sessionIndex - Index of the session being modified
   * @param {string} field - Field being modified (start_time or end_time)
   * @param {string} value - New time value
   */
  const handleTimeChange = (dayIndex, sessionIndex, field, value) => {
    const updatedSlots = [...availabilitySlots];
    updatedSlots[dayIndex].sessions[sessionIndex][field] = value + ":00";
    setAvailabilitySlots(updatedSlots);

    // Only process and notify parent when both start and end times are set
    const currentSession = updatedSlots[dayIndex].sessions[sessionIndex];
    if (currentSession.start_time && currentSession.end_time) {
      // Create flattened slots with 30-minute intervals for the backend
      const flattenedSlots = getFlattenedSlotsWithIntervals(updatedSlots);
      onChange(flattenedSlots);
    }
  };

  // New helper function to create 30-minute intervals for backend
  const getFlattenedSlotsWithIntervals = (slots) => {
    return slots.flatMap((daySlot) =>
      daySlot.sessions
        .filter((session) => session.start_time && session.end_time)
        .flatMap((session) => {
          return splitIntoThirtyMinIntervals(
            session.start_time,
            session.end_time
          ).map((interval) => ({
            day_of_week: daySlot.day_of_week,
            ...interval,
          }));
        })
    );
  };

  /**
   * Helper function to flatten the availability slots structure
   * This is necessary for passing availability data to the parent component.
   * @param {Object[]} slots - The availability slots to flatten
   * @returns {Object[]} Flattened array of sessions with day_of_week, start_time, and end_time
   */
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

  /**
   * Add a new session for a specific day
   * @param {number} dayIndex - The index of the day to add the session to
   */
  const addSession = (dayIndex) => {
    const updatedSlots = [...availabilitySlots];
    updatedSlots[dayIndex].sessions.push({
      start_time: "",
      end_time: "",
    });
    setAvailabilitySlots(updatedSlots);
  };

  /**
   * Remove a session from a specific day
   * If the last session is removed, a default session is added back.
   * @param {number} dayIndex - The index of the day to remove the session from
   * @param {number} sessionIndex - The index of the session to remove
   */
  const removeSession = (dayIndex, sessionIndex) => {
    const updatedSlots = [...availabilitySlots];
    updatedSlots[dayIndex].sessions.splice(sessionIndex, 1);
    if (updatedSlots[dayIndex].sessions.length === 0) {
      updatedSlots[dayIndex].sessions.push({ start_time: "", end_time: "" });
    }
    setAvailabilitySlots(updatedSlots);
    onChange(getFlattenedSlots(updatedSlots));
  };

  // Add these time options at the top of your file
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      options.push(`${hourStr}:00`);
      options.push(`${hourStr}:30`);
    }
    return options;
  };

  const TIME_OPTIONS = generateTimeOptions();

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
                    <select
                      value={session.start_time?.slice(0, 5) || ""}
                      onChange={(e) =>
                        handleTimeChange(
                          dayIndex,
                          sessionIndex,
                          "start_time",
                          e.target.value
                        )
                      }
                      className="time-select"
                    >
                      <option value="">Select Start Time</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <span>to</span>
                    <select
                      value={session.end_time?.slice(0, 5) || ""}
                      onChange={(e) =>
                        handleTimeChange(
                          dayIndex,
                          sessionIndex,
                          "end_time",
                          e.target.value
                        )
                      }
                      className="time-select"
                    >
                      <option value="">Select End Time</option>
                      {TIME_OPTIONS.filter(
                        (time) => time > (session.start_time?.slice(0, 5) || "")
                      ).map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
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
