// src/utils/handleErrors.js
export const handleErrors = (error) => {
  if (error.errors) {
    // If validation errors exist, return them
    return error.errors.map((err) => err.msg).join(", ");
  } else if (error.message) {
    return error.message;
  }
  return "An unknown error occurred.";
};
