// src/dashboard/AdminLayout.jsx
// FIXED: Added Sync and Settings nav items. Removed orphan Settings import.

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard, Store, Box, Users, ShieldCheck,
  LogOut, Bell, Menu, MessageSquare,
  Settings, Database,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout({ children }) {
  const { user, logout, authLoading } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMsgs,  setUnreadMsgs]  = useState(0);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    const fetchUnread = async () => {
      try {
        const res  = await fetch("https://khareedlo-backend-production.up.railway.app/api/contact/unread-count");
        const data = await res.json();
        setUnreadMsgs(data.count || 0);
      } catch {}
    };
    fetchUnread();
    const iv = setInterval(fetchUnread, 60000);
    return () => clearInterval(iv);
  }, [user]);

  const NAV = [
    { to: "/admin",            label: "Dashboard",     icon: LayoutDashboard, end: true },
    { to: "/admin/brands",     label: "Brands",        icon: Store            },
    { to: "/admin/products",   label: "Live Products", icon: Box              },
    { to: "/admin/approvals",  label: "Approvals",     icon: ShieldCheck      },
    { to: "/admin/customers",  label: "Customers",     icon: Users            },
    { to: "/admin/messages",   label: "Messages",      icon: MessageSquare, badge: unreadMsgs },
    { to: "/admin/sync",       label: "Product Sync",  icon: Database         },
    { to: "/admin/settings",   label: "Settings",      icon: Settings         },
  ];

  if (authLoading) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || user.role !== "admin") return <Navigate to="/auth" replace />;

  const today = new Date().toLocaleDateString("en-PK", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="min-h-screen flex bg-[#F0F2F8]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 flex-shrink-0 flex flex-col
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0
        `}
        style={{
          background: "linear-gradient(180deg, #0D0D1A 0%, #12121F 50%, #0A0A15 100%)",
          boxShadow: "4px 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">K</span>
            </div>
            <div>
              <p className="text-white font-bold text-base tracking-tight">Khareedlo</p>
              <p className="text-white/30 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </div>
              {badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-5 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name || "Admin"}</p>
              <p className="text-white/40 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/auth"); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="hidden sm:block text-xs text-gray-400 font-medium">{today}</p>
          </div>

          <div className="flex items-center gap-3">
            {unreadMsgs > 0 && (
              <NavLink
                to="/admin/messages"
                className="relative w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {unreadMsgs > 9 ? "9+" : unreadMsgs}
                </span>
              </NavLink>
            )}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}