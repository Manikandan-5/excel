import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    // only user login allo the page
    
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
