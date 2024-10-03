import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Assuming you have an Auth context

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth(); // Get authentication status from context or any state management
  if (loading) return <p>Loading...</p>; // Show loading indicator while checking authentication status)

  // if not authenticated, redirect to login page
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
