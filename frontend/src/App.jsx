import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadProduct from "./pages/UploadProduct";
import ViewRequests from "./pages/ViewRequests";
import Cart from "./pages/Cart"; // ✅ Added Cart import
import Profile from "./pages/Profile";


// Components
import Navbar from "./components/Navbar";

// ✅ Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* 🏠 Default route → Signup */}
        <Route path="/" element={<Signup />} />

        {/* 🔐 Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        {/* 🚀 Protected routes (only for logged-in users) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-requests"
          element={
            <ProtectedRoute>
              <ViewRequests />
            </ProtectedRoute>
          }
        />

        {/* ✅ Added proper Cart route */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* 🌐 Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
