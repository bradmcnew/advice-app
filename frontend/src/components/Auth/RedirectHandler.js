import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../../features/auth/authSlice"; // Import the login action

const RedirectHandler = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/auth/user", {
          withCredentials: true,
        });

        console.log("Response:", response);

        const data = response.data;
        console.log("User data:", data);

        if (data.success) {
          dispatch(login(data.user)); // Update authentication state in Redux
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error (e.g., display error message)
      }
    };

    fetchUserData();
  }, [dispatch]);

  return <div>Loading...</div>; // Show loading while fetching user data
};

export default RedirectHandler;
