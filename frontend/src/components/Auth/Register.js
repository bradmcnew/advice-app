import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../authService";
import useForm from "../../hooks/useForm";
import Input from "../Common/Input";
import { handleErrors } from "../../utils/handleErrors";
import "../../styles/auth.css";
import { useAuth } from "../../context/AuthContext";
import GoogleLoginButton from "./GoogleLoginButton";

const Register = () => {
  const navigate = useNavigate();
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
      try {
        const response = await registerUser(values);
        console.log("User registered successfully", response);
        // Redirect or show success message
        navigate("/login");
      } catch (error) {
        if (error.response && error.response.data) {
          console.error("Error registering user", error.response.data);
          throw error.response.data;
        }
        console.error("Error registering user", error);
        throw error;
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
