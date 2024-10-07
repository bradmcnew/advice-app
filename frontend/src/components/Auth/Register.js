import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../authService"; // Adjust the path according to your project structure
import useForm from "../../hooks/useForm"; // Ensure this hook is implemented correctly
import Input from "../Common/Input"; // Adjust the import path as necessary
import { handleErrors } from "../../utils/handleErrors"; // Adjust the path according to your project structure
import "../../styles/auth.css";
import { useDispatch } from "react-redux"; // Import Redux hooks
import { register } from "../../features/registration/registrationSlice"; // Import the register action
import GoogleLoginButton from "./GoogleLoginButton";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      username: "",
      email: "",
      password: "",
      role: "", // Single role string
    },
    async () => {
      const actionResult = await dispatch(register(values));
      if (register.fulfilled.match(actionResult)) {
        console.log("User registered successfully");
        navigate("/login");
      } else {
        // Handle registration error
        console.error("Registration failed:", actionResult.error.message);
      }
    }
  );

  return (
    <div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>
        <Input
          label="Username"
          name="username"
          value={values.username}
          onChange={handleChange}
        />
        <Input
          label="Email"
          name="email"
          value={values.email}
          onChange={handleChange}
          type="email"
        />
        <Input
          label="Password"
          name="password"
          value={values.password}
          onChange={handleChange}
          type="password"
        />
        <label>
          <input
            type="radio"
            name="role"
            value="college_student"
            checked={values.role === "college_student"}
            onChange={handleChange}
          />
          College Student
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="high_school"
            checked={values.role === "high_school"}
            onChange={handleChange}
          />
          High School
        </label>
        {errors && <div className="error-message">{handleErrors(errors)}</div>}
        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>
      <GoogleLoginButton />
    </div>
  );
};

export default Register;
