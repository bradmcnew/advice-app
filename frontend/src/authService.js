import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (userData) => {
  console.log("userData", userData);
  const response = await axios.post(`${API_URL}/users/register`, userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_URL}/users/auth/login`, loginData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/users/auth/logout`);
  return response.data;
};
