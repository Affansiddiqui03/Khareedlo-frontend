import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function BrandRoute({ children }) {
  const { user, authLoading } = useAuth();

  console.log("BrandRoute authLoading:", authLoading);
  console.log("BrandRoute user:", user);

  // ⏳ SHOW LOADER INSTEAD OF NULL
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  // ❌ NOT LOGGED IN
  if (!user) return <Navigate to="/auth" replace />;

  // ❌ NOT A BRAND
  if (user.role !== "brand") return <Navigate to="/" replace />;

  // ✅ ALLOW
  return children;
}
