import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./components/Auth/Logout";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import RedirectHandler from "./components/Auth/RedirectHandler";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <h1>User Registration</h1>
          <Navbar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/google/redirect" element={<RedirectHandler />} />
            <Route
              path="/logout"
              element={<ProtectedRoute element={<Logout />} />}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* catch all route */}
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
