import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./components/Auth/Logout";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import ResetPassword from "./components/Auth/ResetPassword";
import RedirectHandler from "./components/Auth/RedirectHandler";
import PasswordResetRequest from "./components/Auth/ResetPasswordRequest";
import About from "./components/Index/About";
import ViewOwnProfile from "./components/Profile/ViewOwnProfile";
import ViewPublicProfile from "./components/Profile/viewPublicProfile";
import EditProfile from "./components/Profile/EditProfile";
import PhotoUpload from "./components/Profile/PhotoUpload";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <h1>App Name</h1>
          <Navbar />
          <Routes>
            <Route path="/about" element={<About />} />
            {/* auth routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/redirect" element={<RedirectHandler />} />
            <Route
              path="/logout"
              element={<ProtectedRoute element={<Logout />} />}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route path="/forgot-password" element={<PasswordResetRequest />} />
            <Route
              path="/auth/reset-password/:token"
              element={<ResetPassword />}
            />
            {/* Profile Routes */}
            <Route
              path="/profile"
              element={<ProtectedRoute element={<ViewOwnProfile />} />}
            />
            <Route
              path="/profile/:id"
              element={<ProtectedRoute element={<ViewPublicProfile />} />}
            />
            <Route
              path="/profile/edit"
              element={<ProtectedRoute element={<EditProfile />} />}
            />
            <Route
              path="/profile/photo-upload"
              element={<ProtectedRoute element={<PhotoUpload />} />}
            />
            {/* catch all route */}
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
