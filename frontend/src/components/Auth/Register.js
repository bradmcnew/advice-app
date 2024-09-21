import React from "react";
import { registerUser } from "../../authService";
import useForm from "../../hooks/useForm";
import Input from "../Common/Input";
import { handleErrors } from "../../utils/handleErrors";
import "../../styles/auth.css";

const Register = () => {
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
