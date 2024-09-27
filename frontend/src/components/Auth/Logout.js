import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../authService"; // Adjust the path according to your project structure
import "../../styles/auth.css";
import { useAuth } from "../../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log("Logout successful");
      logout();
      // Redirect to the login page or home page after logging out
      navigate("/login");
    } catch (error) {
      console.error("Error logging out", error);
      // Handle error (optional)
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access. Please log in again.");
        // Redirect to login page
        navigate("/login");
      }
    }
  };

  return (
    <div className="auth-form">
      <h2>Logout</h2>
      <p>Are you sure you want to log out?</p>
      <button onClick={handleLogout}>Yes, Logout</button>
      <button onClick={() => navigate("/")}>Cancel</button>
    </div>
  );
};

export default Logout;
