import React, { createContext, useContext, useEffect, useState } from "react";
import { checkAuthStatus } from "../axios/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const authData = await checkAuthStatus();
      console.log("Authentication check:", authData); // Log the result
      setIsAuthenticated(authData.authenticated);
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
