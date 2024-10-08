import axios from "axios";

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/users/auth/check-session",
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Unauthorized Access", error);
    return { authenticated: false }; // Return false if an error occurs (e.g., 401 unauthorized)
  }
};
