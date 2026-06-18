// src/pages/brand/SummaryReport.jsx
// FIXED:
// 1. Weekly chart uses correct keys: "cart" and "buy" from /api/brand/pos/summary
// 2. No random fallback — shows "No data yet" honestly
// 3. Top Products sorted correctly by total clicks

import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Printer, Package, ShoppingCart, ExternalLink,
  TrendingUp, Star, BarChart2, Calendar, MapPin, Globe, Award,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell,
} from "recharts";

const brandInfo = {
  "J. By Junaid Jamshed": { city: "Lahore",   website: "www.junaidjamshed.com", founded: "1998", outlets: "350+" },
  "Zellbury":             { city: "Karachi",  website: "www.zellbury.com",      founded: "2015", outlets: "80+"  },
  "Alkaram":              { city: "Karachi",  website: "www.alkaramstudio.com", founded: "1986", outlets: "200+" },
  "Limelight":            { city: "Lahore",   website: "www.limelight.pk",      founded: "2010", outlets: "100+" },
};

export default function SummaryReport() {
  const { theme, brandName, brandId } = useOutletContext();
  const printRef = useRef();

  const [summary,     setSummary]     = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [weeklyData,  setWeeklyData]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  const today       = new Date();
  const reportDate  = today.toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
  const reportMonth = today.toLocaleDateString("en-PK", { year: "numeric", month: "long" });
  const info        = brandInfo[brandName] || { city: "—", website: "—", founded: "—", outlets: "—" };

  useEffect(() => {
    if (!brandId) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sumRes, posRes] = await Promise.all([
          fetch(`https://khareedlo-backend-production.up.railway.app/api/brand/overview/${brandId}`),
          fetch(`https://khareedlo-backend-production.up.railway.app/api/brand/pos/summary/${brandId}`),
        ]);

        const sumData = sumRes.ok ? await sumRes.json() : {};
        const posData = posRes.ok ? await posRes.json() : {};

        setSummary({
          total_products: sumData.total_products || 0,
          cart_clicks:    sumData.cart_clicks    || 0,
          buy_clicks:     sumData.buy_clicks     || 0,
          top_product:    sumData.top_product    || "—",
        });

        // Top products — sorted by total clicks (backend already sorted)
        const prods = Array.isArray(posData.products) ? posData.products : [];
        setTopProducts(prods.slice(0, 5));

        // Weekly chart — uses "cart" and "buy" keys from brandDashboardRoutes
        const days = Array.isArray(posData.last7Days) ? posData.last7Days : [];
        setWeeklyData(days.map(d => ({
          day:  d.day,
          cart: Number(d.cart || d["Add to Cart"] || 0),
          buy:  Number(d.buy  || d["Buy Now"]     || 0),
        })));

      } catch (err) {
        console.error("Report fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [brandId]);

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-64 bg-gray-100 rounded-xl" />
      <div className="h-96 bg-gray-100 rounded-2xl" />
    </div>
  );

  const totalInteractions = summary ? summary.cart_clicks + summary.buy_clicks : 0;
  const engagementRate = summary?.total_products > 0
    ? (totalInteractions / summary.total_products).toFixed(1)
    : "0";

  const pieData = summary ? [
    { name: "Add to Cart", value: summary.cart_clicks, color: theme.accent      },
    { name: "Buy Now",     value: summary.buy_clicks,  color: theme.accentLight },
  ] : [];

  const hasWeeklyData = weeklyData.some(d => d.cart > 0 || d.buy > 0);
  const topProduct    = topProducts[0];

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Summary Report</h1>
          <p className="text-sm text-gray-500 mt-1">Performance report for {reportMonth}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}
        >
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      {/* Printable Report */}
      <div
        ref={printRef}
        id="printable-report"
        className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg print:shadow-none print:rounded-none print:border-0"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {/* Report Header */}
        <div className="relative overflow-hidden px-10 py-10"
          style={{ background: "linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 60%, #0D1117 100%)" }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"
            style={{ background: `radial-gradient(circle, ${theme.accentLight}, transparent)` }} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}>K</div>
                <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">Khareedlo Platform</span>
              </div>
              <h1 className="text-3xl font-bold text-white">{brandName}</h1>
              <p className="text-sm mt-1" style={{ color: theme.accentLight }}>Brand Performance Summary Report</p>

              <div className="flex flex-wrap gap-4 mt-5">
                <span className="flex items-center gap-1.5 text-xs text-white/50"><Calendar className="w-3.5 h-3.5" /> {reportDate}</span>
                <span className="flex items-center gap-1.5 text-xs text-white/50"><MapPin className="w-3.5 h-3.5" /> {info.city}</span>
                <span className="flex items-center gap-1.5 text-xs text-white/50"><Globe className="w-3.5 h-3.5" /> {info.website}</span>
                <span className="flex items-center gap-1.5 text-xs text-white/50"><Award className="w-3.5 h-3.5" /> Est. {info.founded}</span>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="inline-block px-5 py-4 rounded-2xl border"
                style={{ background: `${theme.accent}15`, borderColor: `${theme.accent}33` }}>
                <p className="text-xs text-white/40 mb-1 tracking-wider uppercase">Report Period</p>
                <p className="text-white font-bold text-lg">{reportMonth}</p>
                <p className="text-xs mt-1" style={{ color: theme.accentLight }}>Khareedlo Platform Data</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1" style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentLight}, transparent)` }} />

        {/* Content */}
        <div className="p-8 space-y-8">

          {/* Executive Summary */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 rounded-full" style={{ background: theme.accent }} />
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">Executive Summary</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Products Listed",      val: summary?.total_products || 0,  icon: Package,      color: theme.accent     },
                { label: "Add to Cart Events",   val: summary?.cart_clicks    || 0,  icon: ShoppingCart, color: "#10B981"        },
                { label: "Buy Now Redirects",    val: summary?.buy_clicks     || 0,  icon: ExternalLink, color: "#F59E0B"        },
                { label: "Avg. Engagement",      val: `${engagementRate}x`,          icon: TrendingUp,   color: theme.accentLight },
              ].map(({ label, val, icon: Icon, color }) => (
                <div key={label} className="rounded-2xl p-5 border border-gray-100" style={{ background: `${color}08` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{val}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Weekly Performance Chart */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 rounded-full" style={{ background: theme.accent }} />
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">Weekly Performance</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Bar chart */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">Daily Click Activity (Last 7 Days)</p>
                {!hasWeeklyData ? (
                  <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No click activity recorded yet</div>
                ) : (
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData} barCategoryGap="35%" margin={{ left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="cart" name="Add to Cart" fill={theme.accent}      radius={[3,3,0,0]} />
                        <Bar dataKey="buy"  name="Buy Now"     fill={theme.accentLight} radius={[3,3,0,0]} opacity={0.85} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: theme.accent }} /> Add to Cart
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: theme.accentLight }} /> Buy Now
                  </span>
                </div>
              </div>

              {/* Pie chart */}
              <div className="rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">Click Split</p>
                {totalInteractions > 0 ? (
                  <>
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={4} dataKey="value">
                            {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-3">
                      {pieData.map(d => (
                        <div key={d.name} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                            <span className="text-gray-500">{d.name}</span>
                          </span>
                          <span className="font-bold text-gray-800">
                            {d.value} <span className="text-gray-400 font-normal">
                              ({Math.round(d.value / totalInteractions * 100)}%)
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-300 text-sm">No interaction data yet</div>
                )}
              </div>
            </div>
          </section>

          {/* Top Products Table */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 rounded-full" style={{ background: theme.accent }} />
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">Top Performing Products</h2>
            </div>
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: `${theme.accent}08` }}>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-emerald-600 uppercase tracking-wider">Add to Cart</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-amber-600 uppercase tracking-wider">Buy Now</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-xs">
                        No product-level POS data available yet
                      </td>
                    </tr>
                  ) : topProducts.map((p, i) => {
                    const cart  = Number(p.cart_clicks    || 0);
                    const buy   = Number(p.buy_now_clicks || 0);
                    const total = cart + buy;
                    const medals = ["🥇", "🥈", "🥉"];
                    return (
                      <tr key={p.product_id || i} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 text-center text-base">{medals[i] || `#${i+1}`}</td>
                        <td className="px-5 py-3.5 font-medium text-gray-800">{p.product_name}</td>
                        <td className="px-5 py-3.5 text-center font-semibold text-emerald-600">{cart}</td>
                        <td className="px-5 py-3.5 text-center font-semibold text-amber-600">{buy}</td>
                        <td className="px-5 py-3.5 text-center font-bold text-gray-900">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
          </section>

          {/* Key Insights */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 rounded-full" style={{ background: theme.accent }} />
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">Key Insights</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Best Performing Product",
                  value: topProduct?.product_name || "—",
                  sub:   `${(topProduct?.cart_clicks || 0) + (topProduct?.buy_now_clicks || 0)} total interactions`,
                  icon:  Star,
                  color: "#F59E0B",
                },
                {
                  title: "Conversion Signal",
                  value: totalInteractions > 0
                    ? `${Math.round((summary?.buy_clicks || 0) / totalInteractions * 100)}%`
                    : "0%",
                  sub:   "Users who clicked Buy Now",
                  icon:  TrendingUp,
                  color: "#10B981",
                },
                {
                  title: "Products on Platform",
                  value: summary?.total_products || 0,
                  sub:   "Across Khareedlo marketplace",
                  icon:  BarChart2,
                  color: theme.accentLight,
                },
              ].map(({ title, value, sub, icon: Icon, color }) => (
                <div key={title} className="rounded-2xl p-5 border border-gray-100">
                  <Icon className="w-5 h-5 mb-3" style={{ color }} />
                  <div className="text-xl font-bold text-gray-900 break-words">{value}</div>
                  <div className="text-xs font-semibold text-gray-600 mt-1">{title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-400">
              Auto-generated by <strong className="text-gray-600">Khareedlo Analytics</strong> on {reportDate}.
              Data reflects all-time cumulative platform interactions via POS activity logs.
            </div>
            <div className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Khareedlo © 2026</div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}