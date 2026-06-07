// src/dashboard/BrandLayout.jsx
// UPDATED: Added "Platform Orders" nav item

import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard, TrendingUp, Package,
  FileText, User, LogOut, Menu, ShoppingBag,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { MapPin } from "lucide-react";


const BRAND_THEMES = {
  "J. By Junaid Jamshed": { accent: "#7C3A1E", accentLight: "#B45309", bg: "from-[#7C3A1E]" },
  "Zellbury":              { accent: "#1A4731", accentLight: "#2D6A4F", bg: "from-[#1A4731]" },
  "Alkaram":               { accent: "#5B1F7A", accentLight: "#7C3AED", bg: "from-[#5B1F7A]" },
  "Alkaram Studio":        { accent: "#5B1F7A", accentLight: "#7C3AED", bg: "from-[#5B1F7A]" },
  "Limelight":             { accent: "#B45309", accentLight: "#D97706", bg: "from-[#B45309]" },
};
const DEFAULT_THEME = { accent: "#DC2626", accentLight: "#EA580C", bg: "from-[#DC2626]" };

export default function BrandLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user || user.role !== "brand") return <Navigate to="/auth" replace />;

  const theme    = BRAND_THEMES[user.name] || BRAND_THEMES[user.brand_name] || DEFAULT_THEME;
  const brandId  = user.id || user.brand_id;
  const brandName= user.name || user.brand_name || "Brand";

  const NAV = [
    { to: "/brand",           label: "Overview",         icon: LayoutDashboard, end: true },
    { to: "/brand/analytics", label: "POS Analytics",    icon: TrendingUp                 },
    { to: "/brand/products",  label: "Products",         icon: Package                    },
    { to: "/brand/orders",    label: "Platform Orders",  icon: ShoppingBag                },
    { to: "/brand/report",    label: "Summary Report",   icon: FileText                   },
    { to: "/brand/profile",   label: "Profile",          icon: User                       },
    { to: "/brand/outlets", label: "Outlets",        icon: MapPin  },

  ];

  return (
    <div className="min-h-screen flex bg-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 flex flex-col
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}
        style={{ background: "linear-gradient(180deg, #111827 0%, #1F2937 100%)", boxShadow: "4px 0 30px rgba(0,0,0,0.4)" }}
      >
        {/* Brand header */}
        <div className={`px-5 py-6 bg-gradient-to-r ${theme.bg} to-transparent border-b border-white/10`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}>
              {brandName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{brandName}</p>
              <p className="text-white/40 text-xs">Brand Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "text-white shadow-lg"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`
              }
              style={({ isActive }) => isActive
                ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }
                : {}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <button onClick={() => { logout(); navigate("/auth"); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between"
          style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-gray-900 hidden sm:block">{brandName}</h2>
          </div>
          <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-sm"
            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}>
            {brandName[0]?.toUpperCase()}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet context={{ theme, brandId, brandName }} />
        </main>
      </div>
    </div>
  );
}