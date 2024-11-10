import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosConfig";

// Fetch availability for a user
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

// Set availability
export const setAvailability = createAsyncThunk(
  "availability/setAvailability",
  async (availabilityData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/availability", {
        availability: availabilityData,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Update specific availability slot
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

const availabilitySlice = createSlice({
  name: "availability",
  initialState: {
    availability: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetAvailability: (state) => {
      state.availability = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload.data;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload.data;
      })
      .addCase(setAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSlot = action.payload.data;
        state.availability = state.availability.map((slot) =>
          slot.id === updatedSlot.id ? updatedSlot : slot
        );
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAvailability } = availabilitySlice.actions;
export default availabilitySlice.reducer;
