import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, verifyAuth } from "../features/auth/authSlice";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Use useSelector to get auth state from Redux
  const { isAuthenticated, loading, error, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Check auth status on component mount
    const fetchAuthStatus = async () => {
      await dispatch(verifyAuth());
    };

    fetchAuthStatus();
  }, [dispatch]);

  const handleLogin = (userData) => {
    dispatch(login(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // Show loading indicator or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easier access to AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
