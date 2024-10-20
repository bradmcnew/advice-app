// src/components/PasswordReset.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  resetState,
} from "../../features/forgotPassword/forgotPasswordSlice";
import { useParams } from "react-router-dom";

const PasswordReset = () => {
  const dispatch = useDispatch();
  const { token } = useParams(); // Get the token from the URL
  const { loading, message, error } = useSelector(
    (state) => state.passwordReset
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      dispatch(resetPassword({ token, newPassword, confirmPassword }));
    } else {
      console.log("Passwords do not match");
    }
  };

  const handleReset = () => {
    dispatch(resetState()); // Clear state on component unmount or when resetting
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PasswordReset;
