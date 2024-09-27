import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the path as necessary

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <ul>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
