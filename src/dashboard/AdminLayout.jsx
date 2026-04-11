import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10">Loading...</div>;

  if (!user || user.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
