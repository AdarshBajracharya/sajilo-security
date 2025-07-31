import React from "react";
import { Navigate, Outlet } from "react-router-dom";
 
const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Check if user is logged in and is an admin
  return user != null && user.isAdmin ? <Outlet /> : <Navigate to="login" />;
};
 
export default AdminRoute;