import axios from "axios";

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/auth/check-session`,
      {
        withCredentials: true,
      }
    );
    return response.data;
    // { authenticated: true } if the user is authenticated
  } catch (error) {
    console.error("Unauthorized Access", error);
    return { authenticated: false }; // Return false if an error occurs (e.g., 401 unauthorized)
  }
};

export const getUserData = async () => {
  try {
    console.log(`${process.env.REACT_APP_API_URL}/auth/user`);
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/auth/user`,
      {
        withCredentials: true,
      }
    ); // problem here
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data", error);
    return null;
  }
};
