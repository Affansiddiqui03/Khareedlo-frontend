// src/components/FloatingOrdersButton.jsx
// Global floating button — bottom right corner on every page (for logged-in users)
// Shows active order count badge
// Click → slide-up panel with all orders + Cancel / Refund / Exchange actions
// Brand dashboard auto-updates when user reports an issue

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  ShoppingBag, X, RotateCcw, ArrowLeftRight,
  AlertTriangle, CheckCircle, Clock, Truck,
  ChevronDown, Loader2, Package,
} from "lucide-react";

const BASE = "https://khareedlo-backend-production.up.railway.app";

const STATUS_CFG = {
  reported:  { label: "Pending",   color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",  icon: Clock          },
  confirmed: { label: "Confirmed", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   icon: CheckCircle    },
  delivered: { label: "Delivered", color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-200",icon: Truck          },
  cancelled: { label: "Cancelled", color: "text-red-500",    bg: "bg-red-50",    border: "border-red-200",    icon: X              },
  refunded:  { label: "Refunded",  color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", icon: RotateCcw      },
  exchanged: { label: "Exchanged", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", icon: ArrowLeftRight },
};

const CANCELLED_ST = ["cancelled", "refunded", "exchanged"];

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("en-PK", {
    day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Mini modal for selecting cancel reason ──────────────────────
function ReasonPicker({ order, onConfirm, onBack, loading }) {
  const [reason, setReason] = useState("cancelled");

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
          <ChevronDown className="w-4 h-4 rotate-90" />
        </button>
        <p className="text-sm font-bold text-gray-800">What happened with this order?</p>
      </div>
      <p className="text-xs text-gray-400 line-clamp-1 ml-6">{order.product_name}</p>

      <div className="space-y-2 ml-1">
        {[
          { val: "cancelled", label: "I cancelled the order",    Icon: X              },
          { val: "refunded",  label: "I got a refund",            Icon: RotateCcw      },
          { val: "exchanged", label: "I exchanged the product",   Icon: ArrowLeftRight },
        ].map(({ val, label, Icon }) => (
          <button
            key={val}
            onClick={() => setReason(val)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
              reason === val
                ? "border-red-400 bg-red-50 text-red-700"
                : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
            }`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${reason === val ? "text-red-500" : "text-gray-400"}`} />
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={() => onConfirm(reason)}
        disabled={loading}
        className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
        style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : "Confirm"}
      </button>
    </div>
  );
}

// ── Single order card ───────────────────────────────────────────
function OrderCard({ order, onReportIssue }) {
  const cfg  = STATUS_CFG[order.status] || STATUS_CFG.reported;
  const Icon = cfg.icon;
  const isInactive = CANCELLED_ST.includes(order.status);

  return (
    <div className={`rounded-2xl border p-3.5 transition-all ${isInactive ? "opacity-60 bg-gray-50 border-gray-100" : "bg-white border-gray-100 shadow-sm"}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isInactive ? "bg-gray-100" : "bg-red-50"}`}>
          <ShoppingBag className={`w-5 h-5 ${isInactive ? "text-gray-300" : "text-red-500"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-bold line-clamp-1 ${isInactive ? "text-gray-400 line-through" : "text-gray-800"}`}>
              {order.product_name}
            </p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
              <Icon className="w-2.5 h-2.5" />{cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span>{order.brand_name}</span>
            <span className={`font-bold ${isInactive ? "text-gray-400 line-through" : "text-gray-700"}`}>
              PKR {parseFloat(order.total_price).toLocaleString()}
            </span>
            <span>Qty: {order.quantity}</span>
          </div>
          <p className="text-[10px] text-gray-300 mt-0.5">{fmtDate(order.created_at)}</p>

          {!isInactive && (
            <button
              onClick={() => onReportIssue(order)}
              className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-200 text-red-600 text-[11px] font-bold hover:bg-red-50 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" />
              Cancel / Refund / Exchange
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main floating component ─────────────────────────────────────
export default function FloatingOrdersButton() {
  const { user } = useAuth();

  const [open,        setOpen]        = useState(false);
  const [orders,      setOrders]      = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [reporting,   setReporting]   = useState(null);  // order being actioned
  const [submitting,  setSubmitting]  = useState(false);
  const [toast,       setToast]       = useState("");

  const activeCount = orders.filter(o => !CANCELLED_ST.includes(o.status)).length;

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/orders/customer/${user.id}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch on open
  useEffect(() => {
    if (open) fetchOrders();
  }, [open, fetchOrders]);

  // Also fetch once on mount to get count for badge
  useEffect(() => {
    if (user?.id) fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleConfirmIssue = async (reason) => {
    if (!reporting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/orders/${reporting.id}/cancel`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reason, customer_id: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      // Update locally
      setOrders(prev => prev.map(o =>
        o.id === reporting.id ? { ...o, status: reason } : o
      ));
      setReporting(null);
      setToast(`Order marked as ${reason} ✓`);
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setToast(err.message);
      setTimeout(() => setToast(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // Don't render if not logged in or no orders ever
  if (!user) return null;

  return (
    <>
      {/* ── Floating Button ── */}
      <div className="fixed bottom-6 right-6 z-[400]" style={{ fontFamily: "'Sora','DM Sans',sans-serif" }}>

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-full right-0 mb-3 whitespace-nowrap bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl">
            {toast}
          </div>
        )}

        {/* Panel */}
        {open && (
          <div className="absolute bottom-full right-0 mb-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ maxHeight: "70vh" }}>

            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100"
              style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="text-sm font-extrabold text-white">My Orders</span>
                {activeCount > 0 && (
                  <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {activeCount} active
                  </span>
                )}
              </div>
              <button onClick={() => { setOpen(false); setReporting(null); }}
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Reason picker — shown when user taps "Cancel/Refund/Exchange" */}
            {reporting ? (
              <ReasonPicker
                order={reporting}
                onConfirm={handleConfirmIssue}
                onBack={() => setReporting(null)}
                loading={submitting}
              />
            ) : (
              <div className="overflow-y-auto p-3 space-y-2" style={{ maxHeight: "calc(70vh - 56px)" }}>
                {loading ? (
                  <div className="py-10 flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-red-400 animate-spin" />
                    <p className="text-xs text-gray-400">Loading orders…</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-10 text-center">
                    <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-400">No orders yet</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Confirm a purchase via Khareedlo to see it here
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Active orders first */}
                    {orders.filter(o => !CANCELLED_ST.includes(o.status)).map(o => (
                      <OrderCard key={o.id} order={o} onReportIssue={setReporting} />
                    ))}
                    {/* Divider if both exist */}
                    {orders.some(o => !CANCELLED_ST.includes(o.status)) &&
                     orders.some(o => CANCELLED_ST.includes(o.status)) && (
                      <div className="flex items-center gap-2 py-1">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">Closed</span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>
                    )}
                    {/* Closed orders */}
                    {orders.filter(o => CANCELLED_ST.includes(o.status)).map(o => (
                      <OrderCard key={o.id} order={o} onReportIssue={setReporting} />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* The button itself */}
        <button
          onClick={() => { setOpen(o => !o); setReporting(null); }}
          className="relative w-14 h-14 rounded-2xl text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 hover:shadow-red-300"
          style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}
        >
          <ShoppingBag className="w-6 h-6" />
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-lg">
              {activeCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
}