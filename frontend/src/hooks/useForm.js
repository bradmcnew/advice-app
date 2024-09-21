import { useState } from "react";

const useForm = (initialState, callback) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    const { name, type, checked } = e.target;

    if (type === "checkbox") {
      // If the checkbox is checked, set it as the role; otherwise, clear the role
      setValues((prevValues) => ({
        ...prevValues,
        role: checked ? name : prevValues.role === name ? "" : prevValues.role,
      }));
      return;
    }

    setValues({ ...values, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    try {
      await callback();
    } catch (error) {
      setErrors(error);
    }
  };
  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
};

export default useForm;
