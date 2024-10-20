// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist"; // Import persist functions
import storage from "redux-persist/lib/storage"; // Default storage for web
import { combineReducers } from "redux"; // Import combineReducers
import authReducer from "../features/auth/authSlice";
import registrationReducer from "../features/registration/registrationSlice";
import passwordResetReducer from "../features/forgotPassword/forgotPasswordSlice";

// Step 1: Create the Persist Configuration
const persistConfig = {
  key: "root", // Key for storage
  version: 1, // Version of the persist config
  storage, // Specify that we are using local storage
};

// Step 2: Combine Your Reducers
const rootReducer = combineReducers({
  // Use combineReducers here
  auth: authReducer,
  registration: registrationReducer,
  passwordReset: passwordResetReducer,
  // Add other reducers here as needed
});

// Step 3: Create the Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer); // Use combined reducer

// Step 4: Create the Redux Store
const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types that may have non-serializable values
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Step 5: Create the Persistor
export const persistor = persistStore(store); // Create the persistor

// Step 6: Export the Store
export default store;
