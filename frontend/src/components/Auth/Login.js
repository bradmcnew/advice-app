import React from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../authService"; // Adjust the path according to your project structure
import useForm from "../../hooks/useForm"; // Make sure this hook is implemented correctly
import Input from "../Common/Input"; // Adjust the import path as necessary
import { handleErrors } from "../../utils/handleErrors"; // Adjust the path according to your project structure
import "../../styles/auth.css";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      username: "",
      password: "",
    },
    async () => {
      try {
        const response = await loginUser(values);
        console.log("Login successful:", response);
        login();
        // Redirect to the dashboard or another protected route
        navigate("/dashboard");
      } catch (error) {
        if (error.response && error.response.data) {
          console.error("Error logging in", error.response.data);
          throw error.response.data;
        }
        console.error("Error logging in", error);
        throw error;
      }
    }
  );

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      <Input
        label="Username"
        name="username"
        value={values.username}
        onChange={handleChange}
      />
      <Input
        label="Password"
        name="password"
        value={values.password}
        onChange={handleChange}
        type="password"
      />
      {errors && <div className="error-message">{handleErrors(errors)}</div>}
      <button type="submit">Login</button>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </form>
  );
};

export default Login;
