import React from "react";

const Input = ({ label, name, value, onChange, type = "text", error }) => (
  <div className="input-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      id={name}
    />
    {error && <span className="error">{error}</span>}
  </div>
);

export default Input;
