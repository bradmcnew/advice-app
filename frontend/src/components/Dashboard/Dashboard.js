import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../authService"; // Adjust the path according to your project structure

const Dashboard = () => {
  const navigate = useNavigate();

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
      <h1>Welcome to the Dashboard</h1>
      <p>This is a secure area of the application.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
