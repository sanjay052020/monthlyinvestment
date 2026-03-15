import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks"; // adjust path to your hooks
import { RootState } from "../store";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAppSelector((state: RootState) => state.auth); 
  // ✅ assumes your auth slice stores token

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;