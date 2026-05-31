// src/pages/user/Dashboard.jsx
// UPDATED: Added "My Messages" to quick links section
// FIXED: Weekly chart uses CONVERT_TZ (PKT timezone) via updated userRoutes.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../../components/UserLayout";
import { useAuth } from "../../contexts/AuthContext";
import {
  Store, MousePointerClick, ExternalLink, Package,
  TrendingUp, RefreshCw, ShoppingBag, ChevronRight,
  ArrowUpRight, MessageSquare,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const ACCENT  = "#E53E3E";
const ACCENT2 = "#F97316";
const PURPLE  = "#7C3AED";
const TEAL    = "#0891B2";

function StatCard({ icon: Icon, label, value, color, loading, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-200" />
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-20 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-black text-gray-900">{value ?? 0}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">{label}</p>
          {sub && <p className="text-[10px] text-gray-300 mt-0.5">{sub}</p>}
        </>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const customerId = user?.id;

  const [stats,          setStats]          = useState({ brandVisits: 0, productClicks: 0, buyRedirects: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [weeklyChart,    setWeeklyChart]    = useState([]);
  const [loading,        setLoading]        = useState(true);

  const fetchDashboard = async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const res  = await fetch(`http://localhost:5000/api/user/dashboard?customer_id=${customerId}`);
      const data = await res.json();
      setStats(data.stats || {});
      setRecentProducts(Array.isArray(data.recentProducts) ? data.recentProducts : []);
      setWeeklyChart(Array.isArray(data.weeklyChart)    ? data.weeklyChart    : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, [customerId]);

  const hasChartData = weeklyChart.some(d =>
    (d["Brand Visits"] || 0) > 0 || (d["Product Clicks"] || 0) > 0 || (d["Buy Redirects"] || 0) > 0
  );

  return (
    <UserLayout>
      <div className="space-y-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              👋 Welcome, {user?.name?.split(" ")[0] || "there"}!
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Here's your activity on Khareedlo</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Store}           label="Brand Visits"   value={stats.brandVisits}
            color={PURPLE}         loading={loading}      sub="Brands you've explored"
          />
          <StatCard
            icon={MousePointerClick} label="Products Viewed" value={stats.productClicks}
            color={ACCENT}           loading={loading}       sub="Product pages opened"
          />
          <StatCard
            icon={ExternalLink}    label="Buy Redirects"  value={stats.buyRedirects}
            color={ACCENT2}        loading={loading}      sub="Times you clicked Buy Now"
          />
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            Your Activity — Last 7 Days (Pakistan Time)
          </h2>

          {loading ? (
            <div className="h-52 bg-gray-50 rounded-2xl animate-pulse" />
          ) : !hasChartData ? (
            <div className="h-52 flex flex-col items-center justify-center text-gray-400 text-sm">
              <TrendingUp className="w-8 h-8 mb-2 text-gray-200" />
              No activity in the last 7 days yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyChart} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="Brand Visits"    stroke={PURPLE}  strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Product Clicks"  stroke={ACCENT}  strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Buy Redirects"   stroke={ACCENT2} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recently Viewed Products */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Recently Viewed Products</h2>
            <Link to="/products" className="text-xs font-semibold hover:underline" style={{ color: ACCENT }}>
              Browse All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl overflow-hidden animate-pulse">
                  <div className="h-28 bg-gray-100" />
                  <div className="p-2 space-y-1.5">
                    <div className="h-2.5 bg-gray-100 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-200" />
              No products viewed yet. Start exploring!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {recentProducts.slice(0, 10).map((p, i) => (
                <Link key={i} to={`/product/${p.product_id}`}
                  className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 group border border-gray-100">
                  <div className="h-28 bg-gray-100 overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image.startsWith("http") ? p.image : `http://localhost:5000/${p.image}`}
                        alt={p.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider truncate">{p.brand_name}</p>
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mt-0.5">{p.product_name}</p>
                    {p.price && (
                      <p className="text-xs font-bold mt-1" style={{ color: ACCENT }}>
                        PKR {Number(p.price).toLocaleString()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links — includes My Messages now */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Browse Brands",  to: "/brands",             icon: Store,          color: PURPLE  },
            { label: "All Products",   to: "/products",           icon: ShoppingBag,    color: ACCENT  },
            { label: "My Wishlist",    to: "/dashboard/wishlist", icon: Package,        color: TEAL    },
            { label: "My Messages",    to: "/dashboard/messages", icon: MessageSquare,  color: "#10B981" },
          ].map(({ label, to, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 leading-tight">{label}</span>
            </Link>
          ))}
        </div>

      </div>
    </UserLayout>
  );
}