// src/pages/brand/Analytics.jsx
// FIXED:
// 1. Uses /api/brand/pos/summary/:brandId (not /api/pos/summary) — correct data
// 2. Weekly chart uses "cart"/"buy" keys from brandDashboardRoutes
// 3. Products shown in table — COLUMN WISE: Name | Add to Cart | Buy Now | Total (no filter dropdown)
// 4. Every click counts — cumulative totals shown
// 5. Brand Rating widget preserved

import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from "recharts";
import {
  MousePointerClick, ExternalLink, Package, TrendingUp, Star,
} from "lucide-react";

const IMG_BASE = "http://localhost:5000";

// ── Custom tooltip ─────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white px-3 py-2.5 rounded-xl text-xs shadow-2xl border border-gray-700">
      <p className="text-gray-400 mb-1.5 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Brand Rating Widget (unchanged) ───────────────────────────
function BrandRatingWidget({ brandId, theme }) {
  const [stats,    setStats]    = useState(null);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!brandId) return;
    Promise.all([
      fetch(`http://localhost:5000/api/ratings/brand/${brandId}/stats`).then(r => r.json()),
      fetch(`http://localhost:5000/api/ratings/brand/${brandId}/products`).then(r => r.json()),
    ])
      .then(([s, p]) => { setStats(s); setProducts(Array.isArray(p) ? p : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [brandId]);

  if (loading) return <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-40" />;

  const totalRatings = stats?.total_ratings || 0;
  const avgRating    = Number(stats?.avg_rating) || 0;
  const bars = [
    { label: "5 ★", count: stats?.five_star  || 0 },
    { label: "4 ★", count: stats?.four_star  || 0 },
    { label: "3 ★", count: stats?.three_star || 0 },
    { label: "2 ★", count: stats?.two_star   || 0 },
    { label: "1 ★", count: stats?.one_star   || 0 },
  ];

  return (
    <div className="space-y-5">
      {/* Brand Rating */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full" style={{ background: theme.accent }} />
          <h3 className="font-bold text-gray-900">Your Brand Rating</h3>
        </div>

        {totalRatings === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Star className="w-10 h-10 text-gray-200 mb-2" />
            <p className="text-gray-500 font-medium">No ratings yet</p>
            <p className="text-gray-400 text-sm mt-1">Customers will rate your brand from your brand page</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="text-center flex-shrink-0">
              <div className="text-6xl font-black text-gray-900">{avgRating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-0.5 mt-2">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{totalRatings} rating{totalRatings !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {bars.map(({ label, count }) => {
                const pct = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500 w-8 flex-shrink-0">{label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentLight})` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Product Ratings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ background: theme.accent }} />
          <h3 className="font-bold text-gray-900">Product Ratings</h3>
        </div>
        {products.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center text-gray-400">
            <Star className="w-8 h-8 mb-2 text-gray-200" />
            <p className="text-sm">No product ratings yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Rating</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total Ratings</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stars</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p, i) => {
                const rating = Number(p.live_avg || p.avg_rating) || 0;
                const count  = Number(p.live_count || p.rating_count) || 0;
                return (
                  <tr key={p.product_id || i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-800">{p.product_name}</td>
                    <td className="px-6 py-4 text-center">
                      {rating > 0 ? <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                        : <span className="text-gray-400 text-xs">No ratings</span>}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-700">{count}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Main Analytics Page ────────────────────────────────────────
export default function Analytics() {
  const outlet = useOutletContext() || {};
  const theme  = outlet.theme    || { accent: "#4F46E5", accentLight: "#818CF8" };
  const brandName = outlet.brandName || "Brand";
  const brandId   = outlet.brandId;

  const [chartData, setChartData]  = useState([]);
  const [posData,   setPosData]    = useState([]);
  const [loading,   setLoading]    = useState(true);
  const [error,     setError]      = useState("");

  useEffect(() => {
    if (!brandId) { setError("Brand not found"); setLoading(false); return; }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        // Use brand dashboard route (has correct keys + all 7 days)
        const res = await fetch(`http://localhost:5000/api/brand/pos/summary/${brandId}`);
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();

        const days = Array.isArray(data.last7Days) ? data.last7Days : [];
        setChartData(days.map(d => ({
          day:          d.day,
          "Add to Cart":Number(d.cart || d["Add to Cart"] || 0),
          "Buy Now":    Number(d.buy  || d["Buy Now"]     || 0),
        })));

        setPosData(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        setError("Unable to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [brandId]);

  const totalCart  = posData.reduce((s, p) => s + (Number(p.cart_clicks)    || 0), 0);
  const totalBuy   = posData.reduce((s, p) => s + (Number(p.buy_now_clicks) || 0), 0);
  const totalClicks = totalCart + totalBuy;
  const hasChartData = chartData.some(d => d["Add to Cart"] > 0 || d["Buy Now"] > 0);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-64 bg-gray-100 rounded" />
      <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="h-24 bg-gray-100 rounded-2xl"/>)}</div>
      <div className="h-64 bg-gray-100 rounded-2xl" />
    </div>
  );

  if (error) return <div className="text-red-500 text-sm p-4 bg-red-50 rounded-xl">{error}</div>;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">POS Analytics — {brandName}</h1>
        <p className="text-sm text-gray-500">All clicks are recorded cumulatively. Every Add to Cart and Buy Now counts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Clicks",    val: totalClicks, icon: MousePointerClick, color: theme.accent   },
          { label: "Add to Cart",     val: totalCart,   icon: Package,           color: "#10B981"      },
          { label: "Buy Now Clicks",  val: totalBuy,    icon: ExternalLink,      color: "#F59E0B"      },
          { label: "Products Listed", val: posData.length, icon: TrendingUp,    color: theme.accentLight },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="text-xl font-extrabold text-gray-900">{val}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: theme.accent }} />
          <h3 className="font-semibold text-gray-900">Weekly Activity (Last 7 Days)</h3>
        </div>

        {!hasChartData ? (
          <div className="h-52 flex flex-col items-center justify-center text-gray-400 text-sm">
            <TrendingUp className="w-8 h-8 mb-2 text-gray-200" />
            No click activity in the last 7 days yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Add to Cart" name="Add to Cart" fill={theme.accent}      radius={[4,4,0,0]} />
              <Bar dataKey="Buy Now"     name="Buy Now"     fill={theme.accentLight} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Products — COLUMN WISE: all brands' products with Add to Cart + Buy Now columns */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ background: theme.accent }} />
          <h3 className="font-semibold text-gray-900">All Products — Click Breakdown</h3>
          <span className="ml-auto text-xs text-gray-400">Cumulative all-time counts</span>
        </div>

        {posData.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-emerald-600 uppercase tracking-wider">🛒 Add to Cart</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-amber-600 uppercase tracking-wider">⚡ Buy Now</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posData.map((p, i) => {
                  const cart  = Number(p.cart_clicks    || 0);
                  const buy   = Number(p.buy_now_clicks || 0);
                  const total = cart + buy;
                  const imgSrc = p.image && p.image !== "photos/"
                    ? (p.image.startsWith("http") ? p.image : `${IMG_BASE}/${p.image}`)
                    : null;

                  return (
                    <tr key={p.product_id || i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {imgSrc ? (
                              <img src={imgSrc} alt={p.product_name} className="w-full h-full object-cover"
                                onError={e => { e.currentTarget.style.display = "none"; }} />
                            ) : (
                              <Package className="w-4 h-4 m-auto mt-2.5 text-gray-300" />
                            )}
                          </div>
                          <span className="font-medium text-gray-800 text-sm">{p.product_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="font-bold text-emerald-600 text-base">{cart}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="font-bold text-amber-600 text-base">{buy}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="font-extrabold text-gray-900 text-base">{total}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Totals row */}
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-200">
                  <td className="px-5 py-3 font-bold text-gray-700 text-sm">TOTAL</td>
                  <td className="px-5 py-3 text-center font-extrabold text-emerald-600">{totalCart}</td>
                  <td className="px-5 py-3 text-center font-extrabold text-amber-600">{totalBuy}</td>
                  <td className="px-5 py-3 text-center font-extrabold text-gray-900">{totalClicks}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Brand Rating Widget */}
      <BrandRatingWidget brandId={brandId} theme={theme} />
    </div>
  );
}