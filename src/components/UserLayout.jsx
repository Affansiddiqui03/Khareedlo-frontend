// src/components/UserLayout.jsx  — NEW FILE (replaces UserSideBar.jsx usage)

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, User, Heart, ShoppingBag,
  Settings, LogOut, ChevronRight, Menu, X,
  TrendingUp, HelpCircle
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const NAV = [
  { to: "/dashboard",           label: "Overview",    icon: LayoutDashboard, end: true },
  { to: "/dashboard/profile",   label: "Profile",     icon: User },
  { to: "/dashboard/wishlist",  label: "Wishlist",    icon: Heart },

  // NEW
  { to: "/dashboard/messages",  label: "My Messages", icon: ShoppingBag },

  { to: "/dashboard/settings",  label: "Settings",    icon: Settings },
];
function getInitials(name) {
  return (name || "U").split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

export default function UserLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── Sidebar ───────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0
        `}
        style={{
          background: "linear-gradient(175deg, #0F0F1A 0%, #14142B 60%, #0A0A12 100%)",
          boxShadow: "4px 0 32px rgba(0,0,0,0.4)"
        }}
      >
        {/* Logo */}
        <div className="px-5 pt-7 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">K</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight">Khareedlo</p>
              <p className="text-orange-400 text-[10px] font-semibold tracking-widest uppercase">My Account</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name || "User"}</p>
              <p className="text-white/30 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-white/20 tracking-widest uppercase px-3 mb-3">Menu</p>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-red-600/30 to-orange-500/10 text-white border border-red-500/20"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-400 rounded-full" />}
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-red-400" : "text-white/25 group-hover:text-white/60"}`} />
                  <span>{label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-red-400/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Main ─────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center gap-4 sticky top-0 z-20"
          style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
          <button className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <NavLink to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to Platform</NavLink>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 lg:p-7 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}