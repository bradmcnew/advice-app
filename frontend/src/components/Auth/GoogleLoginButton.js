import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation after login
import { useDispatch } from "react-redux"; // For dispatching actions and selecting data from the store
import { useAuth } from "../../context/AuthContext";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  // Handle Google login button click
  const handleLogin = () => {
    // Redirect the user to your backend OAuth endpoint
    window.open("http://localhost:8000/api/auth/google", "_self"); // Adjust the URL as necessary
  };

  return (
    <button
      className="google-login-button"
      onClick={handleLogin}
      disabled={isAuthenticated}
    >
      {isAuthenticated ? "Logged In" : "Login with Google"}
    </button>
  );
};

export default GoogleLoginButton;
