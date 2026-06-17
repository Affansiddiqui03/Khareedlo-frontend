// src/components/FloatingOrdersButton.jsx
// Global floating button — bottom right, every page, logged-in users only
// Full flow:
//   Cancel  → mark cancelled + void Loyverse/Square POS
//   Refund  → mark refunded  + void POS + refunded_amount recorded
//   Exchange → mark old order as exchanged + void POS
//              → ask which product they exchanged for
//              → open BuyNowModal for new product confirmation
//              → new order saved + new POS entry created

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import BuyNowModal from "./BuyNowModal";
import {
  ShoppingBag, X, RotateCcw, ArrowLeftRight,
  AlertTriangle, CheckCircle, Clock, Truck,
  ChevronLeft, Loader2, Package, Search,
} from "lucide-react";

const BASE = "https://khareedlo-backend-production.up.railway.app";

const STATUS_CFG = {
  reported:  { label: "Pending",   color: "text-amber-600",  bg: "bg-amber-50",  icon: Clock          },
  confirmed: { label: "Confirmed", color: "text-blue-600",   bg: "bg-blue-50",   icon: CheckCircle    },
  delivered: { label: "Delivered", color: "text-emerald-600",bg: "bg-emerald-50",icon: Truck          },
  cancelled: { label: "Cancelled", color: "text-red-500",    bg: "bg-red-50",    icon: X              },
  refunded:  { label: "Refunded",  color: "text-orange-600", bg: "bg-orange-50", icon: RotateCcw      },
  exchanged: { label: "Exchanged", color: "text-purple-600", bg: "bg-purple-50", icon: ArrowLeftRight },
};

const CLOSED_ST = ["cancelled", "refunded", "exchanged"];

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("en-PK", {
    day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Step 1: Pick reason ─────────────────────────────────────────────
function ReasonPicker({ order, onConfirm, onBack, loading }) {
  const [reason, setReason] = useState("cancelled");

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="text-sm font-bold text-gray-800">What happened on brand's website?</p>
      </div>
      <p className="text-[11px] text-gray-400 ml-6 line-clamp-1">{order.product_name}</p>

      <div className="space-y-2 ml-1">
        {[
          { val: "cancelled", label: "I cancelled the order",   desc: "Order removed from records",       Icon: X              },
          { val: "refunded",  label: "I received a refund",     desc: "Amount marked as refunded",        Icon: RotateCcw      },
          { val: "exchanged", label: "I exchanged the product", desc: "Select new product you received",  Icon: ArrowLeftRight },
        ].map(({ val, label, desc, Icon }) => (
          <button
            key={val}
            onClick={() => setReason(val)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
              reason === val
                ? "border-red-400 bg-red-50"
                : "border-gray-100 bg-gray-50 hover:border-gray-200"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              reason === val ? "bg-red-100" : "bg-white"
            }`}>
              <Icon className={`w-4 h-4 ${reason === val ? "text-red-500" : "text-gray-400"}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${reason === val ? "text-red-700" : "text-gray-700"}`}>{label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => onConfirm(reason)}
        disabled={loading}
        className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 mt-1 transition-all hover:shadow-lg"
        style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
          : reason === "exchanged"
            ? <><ArrowLeftRight className="w-4 h-4" /> Continue to Exchange</>
            : <><CheckCircle className="w-4 h-4" /> Confirm</>
        }
      </button>
    </div>
  );
}

// ── Step 2 (Exchange only): Pick new product ────────────────────────
function ExchangeProductPicker({ oldOrder, onProductSelected, onBack }) {
  const [search,   setSearch]   = useState("");
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!oldOrder?.brand_id) return;
    setLoading(true);
    fetch(`${BASE}/api/products/brand/${oldOrder.brand_id}`)
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [oldOrder?.brand_id]);

  const filtered = products.filter(p => {
    const name = (p.product_name || p.name || "").toLowerCase();
    return !search || name.includes(search.toLowerCase());
  }).slice(0, 20);

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-sm font-bold text-gray-800">Which product did you receive?</p>
          <p className="text-[10px] text-gray-400">Select the new item from {oldOrder.brand_name}</p>
        </div>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search product name…"
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </div>

      <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: "280px" }}>
        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className="w-5 h-5 text-red-400 animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">No products found</div>
        ) : (
          filtered.map(p => {
            const pid  = p.id || p.product_id;
            const name = p.product_name || p.name;
            return (
              <button
                key={pid}
                onClick={() => onProductSelected(p)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-white hover:border-red-200 hover:bg-red-50 transition-all text-left"
              >
                {p.image && p.image.startsWith("http") ? (
                  <img
                    src={p.image}
                    alt={name}
                    className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
                    onError={e => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-10 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-gray-300" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 line-clamp-2">{name}</p>
                  <p className="text-[11px] font-black text-red-600 mt-0.5">
                    PKR {Number(p.price).toLocaleString()}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Order Card ──────────────────────────────────────────────────────
function OrderCard({ order, onReportIssue }) {
  const cfg      = STATUS_CFG[order.status] || STATUS_CFG.reported;
  const Icon     = cfg.icon;
  const isInactive = CLOSED_ST.includes(order.status);

  return (
    <div className={`rounded-2xl border p-3.5 transition-all ${
      isInactive ? "opacity-60 bg-gray-50 border-gray-100" : "bg-white border-gray-100 shadow-sm"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isInactive ? "bg-gray-100" : "bg-red-50"
        }`}>
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
            <span className={`font-bold ${isInactive ? "line-through text-gray-400" : "text-gray-700"}`}>
              PKR {parseFloat(order.total_price).toLocaleString()}
            </span>
            <span>×{order.quantity}</span>
          </div>
          {order.status === "refunded" && order.refunded_amount && (
            <p className="text-[10px] text-orange-500 font-semibold mt-0.5">
              Refunded: PKR {parseFloat(order.refunded_amount).toLocaleString()}
            </p>
          )}
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

// ── Main Component ──────────────────────────────────────────────────
export default function FloatingOrdersButton() {
  const { user } = useAuth();

  const [open,          setOpen]          = useState(false);
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [step,          setStep]          = useState("list"); // "list" | "reason" | "exchange_pick"
  const [activeOrder,   setActiveOrder]   = useState(null);
  const [exchangeProduct, setExchangeProduct] = useState(null); // triggers BuyNowModal
  const [submitting,    setSubmitting]    = useState(false);
  const [toast,         setToast]         = useState("");

  const activeCount = orders.filter(o => !CLOSED_ST.includes(o.status)).length;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/orders/customer/${user.id}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { setOrders([]); }
    finally  { setLoading(false); }
  }, [user?.id]);

  useEffect(() => { if (open)    fetchOrders(); }, [open, fetchOrders]);
  useEffect(() => { if (user?.id) fetchOrders(); }, [user?.id]);

  const resetToList = () => { setStep("list"); setActiveOrder(null); setExchangeProduct(null); };

  // ── Cancel or Refund ────────────────────────────────────────────
  const handleReasonConfirm = async (reason) => {
    if (reason === "exchanged") { setStep("exchange_pick"); return; }

    setSubmitting(true);
    try {
      const res  = await fetch(`${BASE}/api/orders/${activeOrder.id}/cancel`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reason, customer_id: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setOrders(prev => prev.map(o =>
        o.id === activeOrder.id ? { ...o, status: reason, refunded_amount: data.refunded_amount } : o
      ));
      showToast(reason === "cancelled" ? "Order cancelled ✓" : "Refund recorded ✓");
      resetToList();
    } catch (err) { showToast(err.message); }
    finally       { setSubmitting(false); }
  };

  // ── Exchange Step 2: void old, open BuyNowModal for new product ─
  const handleExchangeProductSelected = async (newProduct) => {
    setSubmitting(true);
    try {
      // Void old order in Khareedlo + POS
      const res  = await fetch(`${BASE}/api/orders/${activeOrder.id}/cancel`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reason: "exchanged", customer_id: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setOrders(prev => prev.map(o =>
        o.id === activeOrder.id ? { ...o, status: "exchanged" } : o
      ));

      // Trigger BuyNowModal for new product — creates new order + new POS entry
      setExchangeProduct({
        ...newProduct,
        id:         newProduct.id || newProduct.product_id,
        title:      newProduct.product_name || newProduct.name,
        brand_id:   activeOrder.brand_id,
        brand:      activeOrder.brand_name,
        brand_name: activeOrder.brand_name,
      });

      setOpen(false);
      resetToList();
    } catch (err) { showToast(err.message); }
    finally       { setSubmitting(false); }
  };

  // ── Exchange: new order confirmed via BuyNowModal ───────────────
  const handleExchangeOrderSaved = () => {
    showToast("Exchange confirmed ✓ New order recorded");
    setTimeout(() => fetchOrders(), 1000);
    setExchangeProduct(null);
  };

  if (!user) return null;

  return (
    <>
      {/* BuyNowModal for exchange new product */}
      {exchangeProduct && (
        <BuyNowModal
          product={exchangeProduct}
          onClose={() => setExchangeProduct(null)}
          onOrderSaved={handleExchangeOrderSaved}
        />
      )}

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
            style={{ maxHeight: "72vh" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
              <div className="flex items-center gap-2">
                {step !== "list" && (
                  <button onClick={resetToList} className="text-white/70 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="text-sm font-extrabold text-white">
                  {step === "exchange_pick" ? "Select Exchange Product" : "My Orders"}
                </span>
                {step === "list" && activeCount > 0 && (
                  <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {activeCount} active
                  </span>
                )}
              </div>
              <button onClick={() => { setOpen(false); resetToList(); }}
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(72vh - 56px)" }}>

              {step === "list" && (
                <div className="p-3 space-y-2">
                  {loading ? (
                    <div className="py-10 flex flex-col items-center gap-3">
                      <Loader2 className="w-6 h-6 text-red-400 animate-spin" />
                      <p className="text-xs text-gray-400">Loading orders…</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-10 text-center">
                      <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-400">No orders yet</p>
                      <p className="text-xs text-gray-300 mt-1">Confirm a purchase to see it here</p>
                    </div>
                  ) : (
                    <>
                      {orders.filter(o => !CLOSED_ST.includes(o.status)).map(o => (
                        <OrderCard key={o.id} order={o}
                          onReportIssue={(order) => { setActiveOrder(order); setStep("reason"); }} />
                      ))}
                      {orders.some(o => !CLOSED_ST.includes(o.status)) && orders.some(o => CLOSED_ST.includes(o.status)) && (
                        <div className="flex items-center gap-2 py-1">
                          <div className="flex-1 h-px bg-gray-100" />
                          <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">Closed</span>
                          <div className="flex-1 h-px bg-gray-100" />
                        </div>
                      )}
                      {orders.filter(o => CLOSED_ST.includes(o.status)).map(o => (
                        <OrderCard key={o.id} order={o}
                          onReportIssue={(order) => { setActiveOrder(order); setStep("reason"); }} />
                      ))}
                    </>
                  )}
                </div>
              )}

              {step === "reason" && activeOrder && (
                <ReasonPicker
                  order={activeOrder}
                  onConfirm={handleReasonConfirm}
                  onBack={resetToList}
                  loading={submitting}
                />
              )}

              {step === "exchange_pick" && activeOrder && (
                <ExchangeProductPicker
                  oldOrder={activeOrder}
                  onProductSelected={handleExchangeProductSelected}
                  onBack={() => setStep("reason")}
                />
              )}
            </div>
          </div>
        )}

        {/* Floating button */}
        <button
          onClick={() => { setOpen(o => !o); if (open) resetToList(); }}
          className="relative w-14 h-14 rounded-2xl text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105"
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