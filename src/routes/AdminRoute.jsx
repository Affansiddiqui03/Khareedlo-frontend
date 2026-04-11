import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminRoute({ children }) {
const { user, authLoading } = useAuth();

if (authLoading) return null;


  if (!user || user.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }
  return children;
}
