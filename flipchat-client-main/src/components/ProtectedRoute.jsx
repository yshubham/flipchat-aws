import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { currentUser } = useAuthContext();

  return currentUser === null ?  <Navigate to={"/register"} /> : <Outlet />;
};

export default ProtectedRoute;
