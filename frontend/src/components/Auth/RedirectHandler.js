import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getUserData } from "../../axios/auth"; // Ensure this function fetches user data
import { login, logout } from "../../features/auth/authSlice";

const RedirectHandler = () => {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useAuth(); // Assuming you have this method to set auth state
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData(); // Fetch user data from your endpoint
        console.log("User data:", userData);
        if (userData.success) {
          console.log("logging in");
          console.log("ONLY USER: ", userData.user);
          dispatch(login(userData.user)); // Dispatch login action with user data
          navigate("/dashboard"); // Navigate to the dashboard after successful login
        } else {
          console.log("failed to login");
          dispatch(logout()); // Dispatch logout action
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        dispatch(logout()); // Dispatch logout
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate, dispatch]); // Include navigate in the dependency array

  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner
  }

  return null;
};

export default RedirectHandler;
