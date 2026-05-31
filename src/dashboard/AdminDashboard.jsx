// src/dashboard/AdminDashboard.jsx
// REPLACE existing AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  Store, Users, Box, ShieldCheck, TrendingUp, CheckCircle,
  XCircle, Clock, Globe, Phone, Mail, ArrowUpRight,
  AlertTriangle, RefreshCw, Package
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color, sub, loading }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-200" />
      </div>
      {loading ? (
        <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse mb-1" />
      ) : (
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      )}
      <div className="text-sm font-medium text-gray-600 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ brands: 0, users: 0, products: 0, pending_brands: 0, pending_products: 0 });
  const [pendingBrands, setPendingBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [brandsRes, usersRes, productsRes, pendingBrandsRes, pendingProdsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/brands"),
        fetch("http://localhost:5000/api/admin/users"),
        fetch("http://localhost:5000/api/admin/products"),
        fetch("http://localhost:5000/api/admin/brands/pending"),
        fetch("http://localhost:5000/api/admin/products/pending"),
      ]);

      const [brands, users, products, pb, pp] = await Promise.all([
        brandsRes.ok ? brandsRes.json() : [],
        usersRes.ok ? usersRes.json() : [],
        productsRes.ok ? productsRes.json() : [],
        pendingBrandsRes.ok ? pendingBrandsRes.json() : [],
        pendingProdsRes.ok ? pendingProdsRes.json() : [],
      ]);

      setStats({
        brands: Array.isArray(brands) ? brands.length : 0,
        users: Array.isArray(users) ? users.length : 0,
        products: Array.isArray(products) ? products.filter(p => p.status === "APPROVED").length : 0,
        pending_brands: Array.isArray(pb) ? pb.length : 0,
        pending_products: Array.isArray(pp) ? pp.length : 0,
      });

      setPendingBrands(Array.isArray(pb) ? pb : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleBrandAction = async (id, action) => {
    setProcessing(id + action);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/brands/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();
      setPendingBrands(prev => prev.filter(b => b.brand_id !== id));
      setStats(prev => ({
        ...prev,
        pending_brands: prev.pending_brands - 1,
        brands: action === "approve" ? prev.brands + 1 : prev.brands,
      }));
      showToast(action === "approve" ? "Brand approved and is now live! 🎉" : "Brand rejected.", action === "approve" ? "success" : "error");
    } catch {
      showToast("Action failed. Please retry.", "error");
    } finally {
      setProcessing(null);
    }
  };

  const statCards = [
    { icon: Store,      label: "Active Brands",     value: stats.brands,           color: "#7C3AED", sub: "Approved on platform" },
    { icon: Users,      label: "Registered Customers", value: stats.users,          color: "#0EA5E9", sub: "Platform users" },
    { icon: Box,        label: "Live Products",      value: stats.products,          color: "#10B981", sub: "Publicly visible" },
    { icon: Clock,      label: "Pending Brands",     value: stats.pending_brands,    color: "#F59E0B", sub: "Awaiting approval" },
    { icon: ShieldCheck, label: "Pending Products",  value: stats.pending_products,  color: "#EF4444", sub: "Require review" },
  ];

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor and manage the Khareedlo platform</p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map(card => (
            <StatCard key={card.label} {...card} loading={loading} />
          ))}
        </div>

        {/* Alerts row */}
        {(stats.pending_brands > 0 || stats.pending_products > 0) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {stats.pending_brands > 0 && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex-1">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  <strong>{stats.pending_brands} brand{stats.pending_brands > 1 ? "s" : ""}</strong> waiting for your approval below
                </p>
              </div>
            )}
            {stats.pending_products > 0 && (
              <a href="/admin/approvals" className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3 flex-1 hover:bg-red-100 transition-colors">
                <Package className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  <strong>{stats.pending_products} product{stats.pending_products > 1 ? "s" : ""}</strong> waiting for approval →
                </p>
              </a>
            )}
          </div>
        )}

        {/* Pending Brand Approvals */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Pending Brand Applications</h2>
              <p className="text-xs text-gray-400 mt-0.5">Review and approve new brand registrations</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              pendingBrands.length > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
            }`}>
              {pendingBrands.length} pending
            </span>
          </div>

          {loading ? (
            <div className="divide-y divide-gray-50">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : pendingBrands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="font-semibold text-gray-700">All caught up!</p>
              <p className="text-gray-400 text-sm mt-1">No brand applications pending review</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pendingBrands.map(b => {
                const isProcessing = processing === b.brand_id + "approve" || processing === b.brand_id + "reject";
                return (
                  <div key={b.brand_id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-gray-50/50 transition-colors">
                    {/* Logo / Initial */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                      {b.logo ? (
                        <img src={`http://localhost:5000/${b.logo}`} alt={b.brand_name} className="w-full h-full object-cover" />
                      ) : (
                        b.brand_name?.[0]?.toUpperCase() || "B"
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{b.brand_name}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3 h-3" />{b.email}</span>
                        {(b.phone || b.contact) && <span className="flex items-center gap-1 text-xs text-gray-500"><Phone className="w-3 h-3" />{b.phone || b.contact}</span>}
                        {b.website && (
                          <a href={b.website} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-violet-600 hover:underline">
                            <Globe className="w-3 h-3" />{b.website}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleBrandAction(b.brand_id, "approve")}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {isProcessing ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleBrandAction(b.brand_id, "reject")}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        {isProcessing ? "..." : "Reject"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick nav cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Manage Brands",    href: "/admin/brands",    icon: Store,       color: "#7C3AED" },
            { label: "Live Products",    href: "/admin/products",  icon: Box,         color: "#10B981" },
            { label: "Product Approvals",href: "/admin/approvals", icon: ShieldCheck, color: "#EF4444" },
            { label: "Customers",        href: "/admin/customers", icon: Users,       color: "#0EA5E9" },
          ].map(({ label, href, icon: Icon, color }) => (
            <a key={label} href={href}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
                <Icon className="w-4.5 h-4.5" style={{ color }} />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 ml-auto" />
            </a>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}