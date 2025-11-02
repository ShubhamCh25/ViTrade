import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("✅ Successfully logged out");
    navigate("/login");
  };

  // Hide navbar when user is not logged in
  if (!user) return null;

  return (
    <nav className="bg-sky-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo */}
          <Link
            to="/dashboard"
            className="text-xl font-bold text-white hover:text-blue-300"
          >
            ViTrade
          </Link>

          {/* Center: Links */}
          <div className="hidden sm:flex space-x-6">
            <Link to="/dashboard" className="hover:text-blue-400">
              Products
            </Link>
            <Link to="/upload" className="hover:text-blue-400">
              Upload Product
            </Link>
            <Link to="/cart" className="hover:text-blue-400">
              Cart
            </Link>
            <Link to="/view-requests" className="hover:text-blue-400">
              View Requests
            </Link>
            <Link to="/profile" className="hover:text-blue-400">
              Profile
            </Link>
          </div>

          {/* Right Side: Username + Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
