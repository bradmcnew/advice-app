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
      console.log("fetchPublicProfile");
      const response = await axiosInstance.get(`/profile/${id}`);
      console.log("response after", response);
      return response.data;
    } catch (err) {
      return rejectWithValue();
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  "profile/uploadProfilePicture",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/profile/photo-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadResume = createAsyncThunk(
  "profile/uploadResume",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/profile/resume-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Upload failed");
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
    publicProfile: null,
    loading: false,
    error: null,
    uploadLoading: false,
    uploadError: null,
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
        state.publicProfile = action.payload;
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
      })
      .addCase(uploadProfilePicture.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.profile.profile_picture = action.payload.profile_picture;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload;
      })
      .addCase(uploadResume.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.uploadLoading = false;
        if (state.profile) {
          state.profile.resume = action.payload.resume;
        }
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload;
      });
  },
});

export default profileSlice.reducer;
