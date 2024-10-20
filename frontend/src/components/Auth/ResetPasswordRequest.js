// src/components/PasswordResetRequest.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendPasswordResetEmail,
  resetState,
} from "../../features/forgotPassword/forgotPasswordSlice";
import { useAuth } from "../../context/AuthContext";

const PasswordResetRequest = () => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector(
    (state) => state.passwordReset
  );
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendPasswordResetEmail(email));
  };

  const handleReset = () => {
    dispatch(resetState()); // Clear state on component unmount or when resetting
  };

  return (
    <div>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PasswordResetRequest;
