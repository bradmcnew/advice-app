import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../authService"; // Adjust the path according to your project structure
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call your logout function from authService
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
      // Handle error appropriately, e.g., show a notification
    }
  };

  return (
    <div className="dashboard">
      {user ? (
        <>
          <h1>Welcome, {user.username}!</h1>
          <p>Role: {user.role}</p>
          {/* Display other user data as needed */}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
