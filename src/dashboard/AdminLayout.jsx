// src/dashboard/AdminLayout.jsx

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard, Store, Box, Users, ShieldCheck,
  LogOut, Bell, Menu, X, MessageSquare,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import KhareedloLogo from "../assets/khareedlo.png";

export default function AdminLayout({ children }) {
  const { user, logout, authLoading } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchUnread = async () => {
      try {
        const res = await fetch(
          "https://khareedlo-backend-production.up.railway.app/api/contact/unread-count"
        );
        const data = await res.json();
        setUnreadMsgs(data.count || 0);
      } catch {}
    };

    fetchUnread();
    const iv = setInterval(fetchUnread, 60000);
    return () => clearInterval(iv);
  }, [user]);

  const NAV = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/brands", label: "Brands", icon: Store },
    { to: "/admin/products", label: "Live Products", icon: Box },
    { to: "/admin/approvals", label: "Approvals", icon: ShieldCheck },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/messages", label: "Messages", icon: MessageSquare, badge: unreadMsgs },
  ];

  if (authLoading)
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!user || user.role !== "admin")
    return <Navigate to="/auth" replace />;

  const today = new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex bg-[#F0F2F8]">

      {/* Overlay (close sidebar) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ───── SIDEBAR ───── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 flex flex-col
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
        `}
        style={{
          background:
            "linear-gradient(180deg, #0D0D1A 0%, #12121F 50%, #0A0A15 100%)",
        }}
      >

        {/* Mobile close button */}
        <div className="flex justify-between items-center px-5 py-4 lg:hidden">
          <span className="text-white/40 text-xs"></span>

          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 pb-6 border-b border-white/5">
          <div className="flex flex-col items-start">

            <img
              src={KhareedloLogo}
              alt="Khareedlo"
              className="h-20 w-auto object-contain"
            />

            <p className="text-white/30 text-xs font-semibold tracking-widest uppercase">
              Admin Panel
            </p>

          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {label}
              </div>

              {badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* USER */}
        <div className="px-4 py-5 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>

            <div>
              <p className="text-white text-sm font-semibold">{user?.name}</p>
              <p className="text-white/40 text-xs">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/auth");
            }}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm"
          >
            <LogOut className="w-4 h-4 inline mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ───── MAIN ───── */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>

          <p className="hidden sm:block text-xs text-gray-400">
            {today}
          </p>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600" />
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}