import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const ProtectedRoute = ({ element }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(logout());
    }
  }, [isAuthenticated, loading, dispatch]);

  // If loading, return loading indicator
  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while checking authentication status
  }

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, return the protected element
  return element;
};

export default ProtectedRoute;
