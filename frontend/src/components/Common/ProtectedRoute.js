import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Assuming you have an Auth context

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth(); // Get authentication status from context or any state management

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
