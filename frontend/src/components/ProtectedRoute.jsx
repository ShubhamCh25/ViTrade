import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // show alert only if user navigates directly to a protected page
    if (!token && location.pathname !== "/signup" && location.pathname !== "/login") {
      setShowAlert(true);
    }
  }, [token, location.pathname]);

  if (!token) {
    if (showAlert) alert("Please login to continue.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
