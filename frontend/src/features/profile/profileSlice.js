import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosConfig";

// Async thunk for fetching profile data
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetchProfile");
      const response = await axiosInstance.get(`/profile`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchPublicProfile = createAsyncThunk(
  "profile/fetchPublicProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/profile/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue();
    }
  }
);

// Async thunk to edit profile data
export const editProfile = createAsyncThunk(
  "profile/editProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/profile/edit", profileData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPublicProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchPublicProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user_profile;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
