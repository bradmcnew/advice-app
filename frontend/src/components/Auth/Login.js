import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm"; // Ensure this hook is implemented correctly
import Input from "../Common/Input"; // Adjust the import path as necessary
import { handleErrors } from "../../utils/handleErrors"; // Adjust the path according to your project structure
import "../../styles/auth.css";
import { useDispatch } from "react-redux"; // Import Redux hooks
import { login } from "../../features/auth/authSlice"; // Import the login action from Redux
import GoogleLoginButton from "./GoogleLoginButton";
import { useAuth } from "../../context/AuthContext"; // Use your AuthContext

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useAuth(); // Get authentication state from AuthContext
  const [loginError, setLoginError] = useState(null); // State for login error message

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Redirect if already authenticated
    }
  }, [isAuthenticated, navigate]);

  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      username: "",
      password: "",
    },
    async () => {
      setLoginError(null); // Clear previous login error before submitting

      try {
        // Dispatch the login action from Redux and unwrap the result
        const result = await dispatch(login(values)).unwrap();
        console.log("Login successful:", result);
        navigate("/dashboard"); // Redirect to dashboard on successful login
      } catch (error) {
        console.error("Login failed:", error);
        setLoginError(error); // Set error message on failure
      }
    }
  );

  return (
    <div>
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
        {loginError && <div className="error-message">{loginError}</div>}{" "}
        {/* Display login error */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}{" "}
          {/* Change button text when loading */}
        </button>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
      <GoogleLoginButton />
    </div>
  );
};

export default Login;
