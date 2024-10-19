import axiosInstance from "./axios/axiosConfig";

const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (userData) => {
  console.log("userData", userData);
  const response = await axiosInstance.post(`/users/register`, userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  console.log("loginData", loginData);
  if (loginData.google_id) {
    return {
      success: true,
      user: loginData,
    };
  }
  const response = await axiosInstance.post(`/users/auth/login`, loginData);
  return { success: response.data.success, user: response.data.user };
};

export const logoutUser = async () => {
  const response = await axiosInstance.post(`/users/auth/logout`);
  return response.data;
};
