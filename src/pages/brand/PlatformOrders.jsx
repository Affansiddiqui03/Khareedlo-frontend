// src/pages/brand/PlatformOrders.jsx
// Brand Dashboard — Platform Orders
// Filters: All Orders | Confirmed | Cancelled | Refunded | Exchanged
// Totals: show gross for cancelled/refunded/exchanged tabs (not 0)
// Mobile: fully responsive — card view on small screens

import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ShoppingBag, TrendingUp, PackageCheck,
  RefreshCw, ExternalLink, CheckCircle,
  Package, X, AlertTriangle,
} from "lucide-react";

const STATUS_CONFIG = {
  reported:  { label: "Pending",   color: "text-amber-600",  bg: "bg-amber-50",   dot: "bg-amber-400"  },
  confirmed: { label: "Confirmed", color: "text-blue-600",   bg: "bg-blue-50",    dot: "bg-blue-500"   },
  delivered: { label: "Delivered", color: "text-emerald-600",bg: "bg-emerald-50", dot: "bg-emerald-500"},
  cancelled: { label: "Cancelled", color: "text-red-600",    bg: "bg-red-50",     dot: "bg-red-500"    },
  refunded:  { label: "Refunded",  color: "text-orange-600", bg: "bg-orange-50",  dot: "bg-orange-400" },
  exchanged: { label: "Exchanged", color: "text-purple-600", bg: "bg-purple-50",  dot: "bg-purple-500" },
};

const SOURCE_CONFIG = {
  self_reported: { label: "Self Reported", color: "text-gray-600",  bg: "bg-gray-100"   },
  loyverse:      { label: "Loyverse POS",  color: "text-purple-600",bg: "bg-purple-100" },
  square:        { label: "Square POS",    color: "text-blue-600",  bg: "bg-blue-100"   },
};

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("en-PK", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const CANCELLED_STATUSES = ["cancelled", "refunded", "exchanged"];

export default function PlatformOrders() {
  const { theme, brandId } = useOutletContext();

  const [data,    setData]    = useState({ orders: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");

  const fetchOrders = async () => {
    if (!brandId) return;
    setLoading(true);
    try {
      const res  = await fetch(`https://khareedlo-backend-production.up.railway.app/api/orders/brand/${brandId}`);
      const json = await res.json();
      setData(json);
    } catch { setData({ orders: [], summary: {} }); }
    finally   { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchOrders(); }, [brandId]);

  // Filter logic — only status-based tabs remain
  const filtered = filter === "all"
    ? data.orders
    : data.orders.filter(o => o.status === filter);

  const { summary = {} } = data;

  // ── Total row calculation ──────────────────────────────────
  // For cancelled/refunded/exchanged filters: show gross (original) amount
  // For all/confirmed: show only non-cancelled revenue
  const isCancelledTab = CANCELLED_STATUSES.includes(filter);
  const totalQty     = filtered.reduce((s, o) => s + (o.quantity || 0), 0);
  const grossTotal   = filtered.reduce((s, o) => s + parseFloat(o.total_price || 0), 0);
  // For "all" tab: net revenue (exclude cancelled)
  const netForAll    = filter === "all"
    ? data.orders
        .filter(o => !CANCELLED_STATUSES.includes(o.status))
        .reduce((s, o) => s + parseFloat(o.total_price || 0), 0)
    : null;

  const displayTotal      = filter === "all" ? netForAll : grossTotal;
  const showGrossNote     = isCancelledTab;
  const cancelledInFiltered = filtered.filter(o => CANCELLED_STATUSES.includes(o.status)).length;

  const FILTERS = [
    ["all",       "All Orders"],
    ["confirmed", "Confirmed" ],
    ["cancelled", "Cancelled" ],
    ["refunded",  "Refunded"  ],
    ["exchanged", "Exchanged" ],
  ];

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500 flex-shrink-0" />
            Platform Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Orders reported by customers via Khareedlo
            {(summary.loyverse_orders > 0 || summary.square_orders > 0) && " · synced to POS"}
          </p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* KPI Cards — 2 cols on mobile, 3 on sm, 6 on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Orders",       val: summary.total_orders    || 0, icon: ShoppingBag,   color: theme.accent  },
          { label: "Active Orders",      val: summary.active_orders   || 0, icon: CheckCircle,   color: "#10B981"     },
          { label: "Cancelled/Returned", val: summary.cancelled_orders|| 0, icon: AlertTriangle, color: "#EF4444"     },
          { label: "Net Revenue",        val: `PKR ${(summary.total_revenue || 0).toLocaleString()}`, icon: TrendingUp, color: "#10B981" },
          { label: "Total Refunded",     val: `PKR ${(summary.total_refunded || 0).toLocaleString()}`, icon: RefreshCw, color: "#F97316" },
          { label: "Via POS",            val: (summary.loyverse_orders || 0) + (summary.square_orders || 0), icon: PackageCheck, color: "#7C3AED" },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
              style={{ background: color + "15" }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">{val}</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs — scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {FILTERS.map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
              filter === val ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={filter === val ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` } : {}}>
            {label}
          </button>
        ))}
      </div>

      {/* Orders — TABLE on md+, CARDS on mobile */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-200 mx-auto mb-3 animate-spin" />
            <p className="text-gray-400 text-sm">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-bold text-gray-500">No orders found</p>
            <p className="text-xs text-gray-400 mt-1">
              Orders appear here when customers confirm purchases via Khareedlo
            </p>
          </div>
        ) : (
          <>
            {/* ── Desktop table (hidden on mobile) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(order => {
                    const srcCfg = SOURCE_CONFIG[order.source] || SOURCE_CONFIG.self_reported;
                    const stsCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.reported;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800 text-sm line-clamp-1 max-w-[200px]">{order.product_name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">#{order.id}</p>
                        </td>
                        <td className="px-5 py-4 text-center font-semibold text-gray-700">{order.quantity}</td>
                        <td className="px-5 py-4 text-center font-black" style={{ color: theme.accent }}>
                          PKR {parseFloat(order.total_price).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${srcCfg.bg} ${srcCfg.color}`}>
                            {srcCfg.label}
                          </span>
                          {order.loyverse_order_id && (
                            <p className="text-[9px] text-gray-400 mt-0.5">ID: {order.loyverse_order_id.slice(-8)}</p>
                          )}
                          {order.square_order_id && (
                            <p className="text-[9px] text-gray-400 mt-0.5">ID: {order.square_order_id.slice(-8)}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${stsCfg.bg} ${stsCfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stsCfg.dot}`} />
                            {stsCfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[11px] text-gray-500">{fmtDate(order.created_at)}</td>
                        <td className="px-5 py-4 text-[11px] text-gray-500">
                          {order.customer_name || (order.customer_id ? `User #${order.customer_id}` : "Guest")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Totals row */}
                <tfoot>
                  <tr className="bg-gray-50 border-t-2 border-gray-200">
                    <td className="px-5 py-3 font-bold text-gray-700 text-sm">
                      TOTAL ({filtered.length} order{filtered.length !== 1 ? "s" : ""}
                      {!isCancelledTab && cancelledInFiltered > 0 && (
                        <span className="text-red-500 ml-1 text-xs">· {cancelledInFiltered} cancelled</span>
                      )})
                    </td>
                    <td className="px-5 py-3 text-center font-bold text-gray-700">{totalQty}</td>
                    <td className="px-5 py-3 text-center font-extrabold" style={{ color: theme.accent }}>
                      PKR {(displayTotal ?? grossTotal).toLocaleString()}
                      {filter === "all" && cancelledInFiltered > 0 && (
                        <p className="text-[10px] text-gray-400 font-normal">(net, excl. cancelled)</p>
                      )}
                      {showGrossNote && (
                        <p className="text-[10px] text-gray-400 font-normal">(original order value)</p>
                      )}
                    </td>
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* ── Mobile card view (hidden on md+) ── */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map(order => {
                const srcCfg = SOURCE_CONFIG[order.source] || SOURCE_CONFIG.self_reported;
                const stsCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.reported;
                return (
                  <div key={order.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{order.product_name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">#{order.id}</p>
                      </div>
                      <p className="font-black text-sm flex-shrink-0" style={{ color: theme.accent }}>
                        PKR {parseFloat(order.total_price).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${stsCfg.bg} ${stsCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stsCfg.dot}`} />
                        {stsCfg.label}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${srcCfg.bg} ${srcCfg.color}`}>
                        {srcCfg.label}
                      </span>
                      <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        Qty: {order.quantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>{order.customer_name || (order.customer_id ? `User #${order.customer_id}` : "Guest")}</span>
                      <span>{fmtDate(order.created_at)}</span>
                    </div>
                  </div>
                );
              })}
              {/* Mobile total */}
              <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">
                  Total ({filtered.length} orders)
                </span>
                <div className="text-right">
                  <p className="font-extrabold text-sm" style={{ color: theme.accent }}>
                    PKR {(displayTotal ?? grossTotal).toLocaleString()}
                  </p>
                  {showGrossNote && (
                    <p className="text-[10px] text-gray-400">original value</p>
                  )}
                  {filter === "all" && cancelledInFiltered > 0 && (
                    <p className="text-[10px] text-gray-400">net revenue</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 text-sm text-blue-700">
        <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <strong>How orders are recorded:</strong> When a customer clicks Buy Now on your product,
          they are redirected to your website. After their purchase, a confirmation modal appears on
          Khareedlo asking them to confirm the order and quantity.
          {(summary.loyverse_orders > 0 || summary.square_orders > 0) && (
            <> Confirmed orders are also synced to your POS system automatically.</>
          )}
        </div>
      </div>
    </div>
  );
}