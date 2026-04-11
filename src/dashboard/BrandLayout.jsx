// src/dashboard/BrandLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Box, Database, User, BarChart2, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function BrandLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ⛔ Safety (BrandRoute already protect kar raha hai)
  if (!user || user.role !== "brand") {
    navigate("/auth", { replace: true });
    return null;
  }

  const brandName = user.name || "Your Brand";

  const nav = [
    { to: "/brand", label: "Overview", icon: <Home /> },
    { to: "/brand/analytics", label: "POS Analytics", icon: <BarChart2 /> },
    { to: "/brand/products", label: "Products", icon: <Box /> },
    { to: "/brand/report", label: "Summary Report", icon: <Database /> },
    { to: "/brand/profile", label: "Profile", icon: <User /> },
  ];

  console.log(user)

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md border-r hidden md:block">
        <div className="px-6 py-6">
          <div className="font-bold text-lg text-indigo-700">KHAREEDLO</div>
          <div className="text-sm text-gray-500">Brand Dashboard</div>
          <div className="text-xs text-gray-400 mt-1">Hi, {brandName}</div>
        </div>

        <nav className="px-4 py-6">
          <ul className="space-y-1">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink
                  end={n.to === "/brand"}
                  to={n.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <span className="text-indigo-500">{n.icon}</span>
                  <span>{n.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t pt-4">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
