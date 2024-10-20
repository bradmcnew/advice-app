import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  sendPasswordResetEmail as sendEmailAPI,
  resetPassword as resetPasswordAPI,
} from "../../authService";

const initialState = {
  loading: false,
  error: null,
  message: null,
};

// Thunk for sending password reset email
export const sendPasswordResetEmail = createAsyncThunk(
  "passwordReset/sendEmail",
  async (email) => {
    const message = await sendEmailAPI(email);
    return message;
  }
);

// Thunk for resetting the password
export const resetPassword = createAsyncThunk(
  "passwordReset/resetPassword",
  async ({ token, newPassword, confirmPassword }) => {
    const message = await resetPasswordAPI({
      token,
      newPassword,
      confirmPassword,
    }); // Call the API function
    return message; // Return the message from the API
  }
);

// Create the slice
const passwordResetSlice = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendPasswordResetEmail.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(sendPasswordResetEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the actions and reducer
export const { resetState } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;
