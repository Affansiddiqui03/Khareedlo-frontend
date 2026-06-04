import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Box,
  Users,
  Package
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import KhareedloLogo from "../assets/khareedlo.png";

export default function AdminSidebar() {
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition ${isActive
      ? "bg-[#ffb48f] text-black"
      : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="mb-8">
          <img
            src={ KhareedloLogo }
            alt="Khareedlo"
            className="h-32 w-auto mb-1"
          />  <span className="block text-xs text-gray-400 font-semibold tracking-widest uppercase pl-1">Admin Panel</span>
        </div>

        <nav className="space-y-3">
          <NavLink to="/admin" end className={ linkClass }>
            <LayoutDashboard /> Dashboard
          </NavLink>

          <NavLink to="/admin/brands" className={ linkClass }>
            <Store /> Brands
          </NavLink>

          <NavLink to="/admin/products" className={ linkClass }>
            <Box /> Products
          </NavLink>

          <NavLink to="/admin/pending-products" className={ linkClass }>
            <Package /> Product Approvals
          </NavLink>
          <NavLink>

          </NavLink>

          <NavLink to="/admin/users" className={ linkClass }>
            <Users /> Customers
          </NavLink>
        </nav>
      </div>

      <button
        onClick={ logout }
        className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold"
      >
        Logout
      </button>
    </div>
  );
}