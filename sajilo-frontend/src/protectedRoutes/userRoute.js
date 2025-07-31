import React from "react";
import { Navigate, Outlet } from "react-router-dom";
 
const UserRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Check if user is logged in
  return user != null ? <Outlet /> : <Navigate to="login" />;
};
 
export default UserRoute;