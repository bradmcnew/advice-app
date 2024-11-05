// src/features/registration/registrationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser } from "../../authService"; // Adjust path if necessary

const initialState = {
  username: "",
  email: "",
  password: "",
  role: "",
  loading: false,
  error: null,
};

// Async thunk for user registration
export const register = createAsyncThunk(
  "registration/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data); // Send back the error message
    }
  }
);

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const { username, email, password, role } = action.payload;
      state.username = username;
      state.email = email;
      state.password = password;
      state.role = role;
    },
    clearRegistrationState: (state) => {
      state.username = "";
      state.email = "";
      state.password = "";
      state.role = "";
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        // Clear the registration state after successful registration
        registrationSlice.caseReducers.clearRegistrationState(state);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      });
  },
});

// Export actions
export const { setUserData, clearRegistrationState } =
  registrationSlice.actions;

// Export reducer
export default registrationSlice.reducer;
