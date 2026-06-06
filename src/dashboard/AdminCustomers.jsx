// src/dashboard/AdminCustomers.jsx  (NEW FILE)

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import {
  Users, Search, RefreshCw, Mail, User,
  CheckCircle, XCircle, Calendar, Hash
} from "lucide-react";

function getInitials(name) {
  return (name || "?").split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

const AVATAR_COLORS = [
  "from-violet-500 to-purple-700",
  "from-rose-500 to-red-600",
  "from-emerald-500 to-green-700",
  "from-sky-500 to-blue-700",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-fuchsia-700",
];

function getColor(name) {
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/admin/users");
      const data = res.ok ? await res.json() : [];
      setCustomers(Array.isArray(data) ? data : []);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  // First letter groups for the list
  const grouped = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    const groups = {};
    sorted.forEach(c => {
      const key = (c.name?.[0] || "#").toUpperCase();
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    return groups;
  }, [filtered]);

  return (
    <AdminLayout>
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500 text-sm mt-1">
              {customers.length} registered user{customers.length !== 1 ? "s" : ""} on the platform
            </p>
          </div>
          <button onClick={fetchCustomers}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 self-start transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Total Registered", value: customers.length, color: "#7C3AED" },
            { label: "Shown in Search", value: filtered.length, color: "#0EA5E9" },
            { label: "Platform Coverage", value: customers.length > 0 ? "Active" : "None", color: "#10B981" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{loading ? "—" : value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 bg-gray-50 border-b border-gray-100 px-6 py-3.5">
            <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wider">#</div>
            <div className="col-span-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</div>
            <div className="col-span-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</div>
            <div className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">ID</div>
          </div>

          {loading ? (
            <div className="divide-y divide-gray-50">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center">
              <Users className="w-12 h-12 text-gray-200 mb-3" />
              <p className="font-semibold text-gray-700">{search ? "No customers match your search" : "No customers yet"}</p>
              <p className="text-gray-400 text-sm mt-1">Customers who register on Khareedlo appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {[...filtered]
                .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                .map((c, index) => {
                  const color = getColor(c.name);
                  const id = c.customer_id || c.user_id || c.id;
                  return (
                    <div
                      key={id || index}
                      className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 px-6 py-4 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Index */}
                      <div className="hidden md:block col-span-1 text-xs text-gray-400 font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      {/* Avatar + Name */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {getInitials(c.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{c.name || "Unknown"}</p>
                          {/* Email shown on mobile */}
                          <p className="text-xs text-gray-400 truncate md:hidden">{c.email}</p>
                        </div>
                      </div>

                      {/* Email (desktop) */}
                      <div className="hidden md:flex col-span-5 items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>

                      {/* ID */}
                      <div className="hidden md:flex col-span-2 items-center justify-center">
                        <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg">
                          #{id || "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing <strong className="text-gray-600">{filtered.length}</strong> of <strong className="text-gray-600">{customers.length}</strong> customers
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}