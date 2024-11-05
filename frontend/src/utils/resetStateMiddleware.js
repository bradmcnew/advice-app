// src/middleware/resetStateMiddleware.js
const resetStateMiddleware = (store) => (next) => (action) => {
  if (action.type === "auth/logout/fulfilled") {
    // Dispatch actions to reset each relevant slice's state
    store.dispatch({ type: "profile/resetProfile" });
    // Add any other slices that should reset on logout
  }
  return next(action);
};

export default resetStateMiddleware;
