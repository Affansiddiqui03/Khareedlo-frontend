// src/pages/brand/Overview.jsx
// FIXED:
// 1. Chart uses real data from /api/brand/pos/summary with correct "Add to Cart"/"Buy Now" keys
// 2. Top Products sorted by total clicks DESC (not showing 1 for everything)
// 3. No random fallback — shows empty state if no data yet

import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Package, ShoppingCart, ExternalLink, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const defaultTheme = { accent: "#4F46E5", accentLight: "#818CF8" };

const IMG_BASE = "https://khareedlo-backend-production.up.railway.app";

export default function Overview() {
  const { user } = useAuth();
  const outletContext = useOutletContext();
  const theme    = outletContext?.theme    || defaultTheme;
  const brandName= outletContext?.brandName|| "Brand";
  const brandId  = outletContext?.brandId  || user?.id;

  const [stats,       setStats]      = useState({ total_products: 0, cart_clicks: 0, buy_clicks: 0 });
  const [topProducts, setTopProducts]= useState([]);
  const [weeklyData,  setWeeklyData] = useState([]);
  const [loading,     setLoading]    = useState(true);

  useEffect(() => {
    if (!brandId) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [overviewRes, posRes] = await Promise.all([
          fetch(`https://khareedlo-backend-production.up.railway.app/api/brand/overview/${brandId}`),
          fetch(`https://khareedlo-backend-production.up.railway.app/api/brand/pos/summary/${brandId}`),
        ]);

        const overviewData = overviewRes.ok ? await overviewRes.json() : {};
        const posData      = posRes.ok      ? await posRes.json()      : {};

        setStats({
          total_products: overviewData.total_products || 0,
          cart_clicks:    overviewData.cart_clicks    || 0,
          buy_clicks:     overviewData.buy_clicks     || 0,
        });

        // Products sorted by total clicks (DESC) — already sorted from backend
        const prods = Array.isArray(posData.products) ? posData.products : [];
        setTopProducts(prods);

        // Weekly chart — all 7 days filled, keys: "Add to Cart" and "Buy Now"
        // Backend /api/brand/pos/summary returns { day, cart, buy }
        // We map to { day, "Add to Cart", "Buy Now" } for the chart
        const chartRows = Array.isArray(posData.last7Days) ? posData.last7Days : [];
        setWeeklyData(chartRows.map(r => ({
          day:          r.day,
          "Add to Cart":Number(r.cart || r["Add to Cart"] || 0),
          "Buy Now":    Number(r.buy  || r["Buy Now"]     || 0),
        })));

      } catch (err) {
        console.error("Overview fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [brandId]);

  if (loading) return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-7 w-48 bg-gray-100 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
      </div>
      <div className="h-56 bg-gray-100 rounded-2xl" />
    </div>
  );

  const hasChartData = weeklyData.some(d => d["Add to Cart"] > 0 || d["Buy Now"] > 0);

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {brandName}</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview Dashboard</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Package,      label: "Total Products", val: stats.total_products, color: theme.accent },
          { icon: ShoppingCart, label: "Add to Cart",    val: stats.cart_clicks,    color: "#10B981"     },
          { icon: ExternalLink, label: "Buy Now Clicks", val: stats.buy_clicks,     color: "#F59E0B"     },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{val}</p>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: theme.accent }} />
          <h2 className="font-bold text-gray-900">Weekly Activity (Last 7 Days)</h2>
        </div>

        {!hasChartData ? (
          <div className="h-48 flex flex-col items-center justify-center text-gray-400 text-sm">
            <TrendingUp className="w-8 h-8 mb-2 text-gray-200" />
            No activity in the last 7 days yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="cartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={theme.accent}      stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.accent}      stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="buyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={theme.accentLight} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.accentLight} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontSize: 12 }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="Add to Cart" stroke={theme.accent}      fill="url(#cartGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Buy Now"     stroke={theme.accentLight} fill="url(#buyGrad)"  strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Products — sorted by total clicks */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: theme.accent }} />
          <h2 className="font-bold text-gray-900">Top Products by Clicks</h2>
        </div>

        {topProducts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No product click data yet</p>
        ) : (
          <div className="space-y-3">
            {topProducts.slice(0, 5).map((p, i) => {
              const cart     = Number(p.cart_clicks    || 0);
              const buy      = Number(p.buy_now_clicks || 0);
              const total    = cart + buy;
              const maxTotal = (topProducts[0]?.cart_clicks || 0) + (topProducts[0]?.buy_now_clicks || 0) || 1;
              const pct      = Math.round((total / maxTotal) * 100);
              const medals   = ["🥇", "🥈", "🥉"];

              return (
                <div key={p.product_id || i} className="flex items-center gap-3">
                  {/* Rank */}
                  <span className="text-base flex-shrink-0 w-6 text-center">
                    {medals[i] || `${i + 1}`}
                  </span>

                  {/* Thumbnail */}
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {p.image && p.image !== "photos/" ? (
                      <img
                        src={p.image.startsWith("http") ? p.image : `${IMG_BASE}/${p.image}`}
                        alt={p.product_name}
                        className="w-full h-full object-cover"
                        onError={e => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <Package className="w-4 h-4 m-auto mt-2.5 text-gray-300" />
                    )}
                  </div>

                  {/* Name + progress bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.product_name}</p>
                      <span className="text-sm font-extrabold text-gray-900 ml-2 flex-shrink-0">{total}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentLight})` }}
                      />
                    </div>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px] text-gray-400">🛒 {cart} cart</span>
                      <span className="text-[10px] text-gray-400">⚡ {buy} buy</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}