// src/pages/brand/PlatformOrders.jsx
// Brand Dashboard — Platform Orders section
// Shows orders from self-reported + Loyverse (Alkaram) + Square (Limelight)
// Accessed via /brand/orders route

import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AdminLayout from "../../dashboard/BrandLayout";
import {
  ShoppingBag, TrendingUp, PackageCheck,
  RefreshCw, ExternalLink, Clock, CheckCircle,
  Truck, Filter, Package,
} from "lucide-react";

const STATUS_CONFIG = {
  reported:  { label: "Reported",  color: "text-amber-600",  bg: "bg-amber-50",   icon: Clock       },
  confirmed: { label: "Confirmed", color: "text-blue-600",   bg: "bg-blue-50",    icon: CheckCircle },
  delivered: { label: "Delivered", color: "text-emerald-600",bg: "bg-emerald-50", icon: Truck       },
};

const SOURCE_CONFIG = {
  self_reported: { label: "Self Reported", color: "text-gray-600",  bg: "bg-gray-100"  },
  loyverse:      { label: "Loyverse POS",  color: "text-purple-600",bg: "bg-purple-100"},
  square:        { label: "Square POS",    color: "text-blue-600",  bg: "bg-blue-100"  },
};

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("en-PK", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function PlatformOrders() {
  const { theme, brandId } = useOutletContext();

  const [data,    setData]    = useState({ orders: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");

  const fetchOrders = async () => {
    if (!brandId) return;
    setLoading(true);
    try {
      const res  = await fetch(`http://localhost:5000/api/orders/brand/${brandId}`);
      const json = await res.json();
      setData(json);
    } catch { setData({ orders: [], summary: {} }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [brandId]);

  const filtered = filter === "all"
    ? data.orders
    : data.orders.filter(o => o.source === filter || o.status === filter);

  const { summary = {} } = data;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-red-500" />
            Platform Orders
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Orders reported by customers via Khareedlo
            {(summary.loyverse_orders > 0 || summary.square_orders > 0) &&
              " · synced to POS"}
          </p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",    val: summary.total_orders   || 0, icon: ShoppingBag,  color: theme.accent   },
          { label: "Total Revenue",   val: `PKR ${(summary.total_revenue || 0).toLocaleString()}`, icon: TrendingUp, color: "#10B981" },
          { label: "Via Loyverse",    val: summary.loyverse_orders|| 0, icon: PackageCheck, color: "#7C3AED"      },
          { label: "Via Square",      val: summary.square_orders  || 0, icon: PackageCheck, color: "#2563EB"      },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: color + "15" }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-xl font-extrabold text-gray-900">{val}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          ["all",           "All Orders"     ],
          ["self_reported", "Self Reported"  ],
          ["loyverse",      "Loyverse POS"   ],
          ["square",        "Square POS"     ],
          ["reported",      "Pending"        ],
          ["confirmed",     "Confirmed"      ],
          ["delivered",     "Delivered"      ],
        ].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === val ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={filter === val ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` } : {}}>
            {label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-200 mx-auto mb-3 animate-spin" />
            <p className="text-gray-400 text-sm">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <p className="font-bold text-gray-500">No orders found</p>
            <p className="text-xs text-gray-400 mt-1">
              Orders appear here when customers confirm purchases via Khareedlo
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                  const StsIcon = stsCfg.icon;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800 text-sm line-clamp-1 max-w-[200px]">
                          {order.product_name}
                        </p>
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
                          <StsIcon className="w-3 h-3" />{stsCfg.label}
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
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-50 border-t-2 border-gray-200">
                    <td className="px-5 py-3 font-bold text-gray-700">TOTAL ({filtered.length} orders)</td>
                    <td className="px-5 py-3 text-center font-bold text-gray-700">
                      {filtered.reduce((s, o) => s + (o.quantity || 0), 0)}
                    </td>
                    <td className="px-5 py-3 text-center font-extrabold" style={{ color: theme.accent }}>
                      PKR {filtered.reduce((s, o) => s + parseFloat(o.total_price || 0), 0).toLocaleString()}
                    </td>
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 text-sm text-blue-700">
        <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
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