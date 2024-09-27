import axios from "axios";

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api", // Change to your API's base URL
  withCredentials: true, // Enables sending cookies with requests
});

export default axiosInstance;
