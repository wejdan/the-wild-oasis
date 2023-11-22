import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { auth } from "../firebase";

const ProtectedRoute = ({ children }) => {
  if (auth?.currentUser?.uid) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }

  // If user is logged in, render the child components
};

export default ProtectedRoute;
