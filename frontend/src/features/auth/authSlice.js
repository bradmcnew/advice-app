// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../../authService";
import { checkAuthStatus } from "../../axios/auth";

// Thunks for logging in and logging out users
export const login = createAsyncThunk(
  "auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await loginUser(loginData);
      return response; // Return the response data
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutUser();
      return response; // Return the response data
    } catch (err) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  }
);

// Initial state
const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
};

// Async thunk for checking authentication status
export const verifyAuth = createAsyncThunk(
  "auth/verifyAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkAuthStatus();
      return { authenticated: response.authenticated }; // Return authenticated status
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to verify authentication status"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle pending, fulfilled, and rejected states for verifyAuth
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
        state.error = null; // C revious errors
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        if (action.payload.authenticated) {
          // If user is authenticated
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
        state.loading = false;
      })
      .addCase(verifyAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error =
          action.payload || "Failed to verify authentication status";
      })
      // Handle login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload.success) {
          // Assuming response has a success field
          state.isAuthenticated = true; // User is logged in
          state.user = action.payload.user; // Store user data
        } else {
          state.isAuthenticated = false; // Set to false if login was not successful
          state.user = null; // Clear user data
        }
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      // Handle logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false; // User is logged out
        state.user = null; // Clear user data
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

// Export reducer
export default authSlice.reducer;
