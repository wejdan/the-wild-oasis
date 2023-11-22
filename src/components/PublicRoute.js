// src/components/PrivateRoute.js
import React, { useContext } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";
import { auth } from "../firebase";

const PublicRoute = ({ children }) => {
  if (auth?.currentUser?.uid) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className=" flex items-center justify-center h-screen">
      {children}
    </main>
  );
};

export default PublicRoute;
