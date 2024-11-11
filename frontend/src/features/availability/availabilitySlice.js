/**
 * Redux slice for managing user availability
 * @module availabilitySlice
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosConfig";
import { fetchProfile } from "../profile/profileSlice";

/**
 * Fetch availability for a specific user
 * @async
 * @param {string} userProfileId - The ID of the user profile
 * @returns {Promise<Object>} The availability data
 */
export const fetchAvailability = createAsyncThunk(
  "availability/fetchAvailability",
  async (userProfileId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/availability/${userProfileId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

/**
 * Set availability for the current user
 * @async
 * @param {Array<Object>} availabilityData - Array of availability slots
 * @param {string} availabilityData[].day_of_week - Day of the week
 * @param {string} availabilityData[].start_time - Start time in HH:MM:SS format
 * @param {string} availabilityData[].end_time - End time in HH:MM:SS format
 * @returns {Promise<Object>} The updated availability data
 */
export const setAvailability = createAsyncThunk(
  "availability/setAvailability",
  async (availabilityData, { rejectWithValue }) => {
    try {
      console.log("Sending availability data:", availabilityData); // Debug log
      const response = await axiosInstance.post("/availability", {
        availability: availabilityData,
      });
      console.log("Response from server:", response.data); // Debug log
      return response.data;
    } catch (err) {
      console.error("Error in setAvailability:", err); // Debug log
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/**
 * Update a specific availability slot
 * @async
 * @param {Object} params - The parameters for updating availability
 * @param {string} params.availabilityId - ID of the availability slot to update
 * @param {Object} params.updates - The updates to apply
 * @returns {Promise<Object>} The updated availability slot
 */
export const updateAvailability = createAsyncThunk(
  "availability/updateAvailability",
  async ({ availabilityId, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/availability/${availabilityId}`,
        updates
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

/**
 * Initial state for the availability slice
 * @type {Object}
 */
const initialState = {
  availability: [],
  loading: false,
  error: null,
};

/**
 * Redux slice for availability management
 */
const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {
    /**
     * Reset availability state to initial values
     * @param {Object} state - Current state
     */
    resetAvailability: (state) => {
      state.availability = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch availability lifecycle
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        // Normalize response data to ensure consistent format
        state.availability = Array.isArray(action.payload.data)
          ? action.payload.data
          : action.payload.data.availability || [];
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload.data || [];
        console.log("Updated availability state:", state.availability); // Debug log
      });
    // ... similar patterns for other async actions
  },
});

export const { resetAvailability } = availabilitySlice.actions;
export default availabilitySlice.reducer;
