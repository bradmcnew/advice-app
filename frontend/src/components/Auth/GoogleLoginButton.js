// src/components/Common/GoogleLoginButton.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation after login
import { useAuth } from "../../context/AuthContext";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Get login function from context

  // Handle Google login button click
  const handleLogin = () => {
    // Redirect the user to your backend OAuth endpoint
    window.open("http://localhost:8000/api/auth/google", "_self"); // Adjust the URL as necessary
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <button className="google-login-button" onClick={handleLogin}>
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
