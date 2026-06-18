// src/components/FloatingOrdersButton.jsx
// Global floating button — bottom right, every page, logged-in users only
// Full flow:
//   Cancel  → mark cancelled + void Loyverse/Square POS
//   Refund  → mark refunded  + void POS + refunded_amount recorded
//   Exchange → Step 1: reason picker (old order NOT voided yet)
//              Step 2: ExchangeProductPicker — search + sub-category filter
//              Step 3: BuyNowModal for new product confirmation
//              Only AFTER new product confirmed → old order voided + new order created

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
  reported:  { label: "Pending",   color: "text-amber-600",  bg: "bg-amber-50",   icon: Clock          },
  confirmed: { label: "Confirmed", color: "text-blue-600",   bg: "bg-blue-50",    icon: CheckCircle    },
  delivered: { label: "Delivered", color: "text-emerald-600",bg: "bg-emerald-50", icon: Truck          },
  cancelled: { label: "Cancelled", color: "text-red-500",    bg: "bg-red-50",     icon: X              },
  refunded:  { label: "Refunded",  color: "text-orange-600", bg: "bg-orange-50",  icon: RotateCcw      },
  exchanged: { label: "Exchanged", color: "text-purple-600", bg: "bg-purple-50",  icon: ArrowLeftRight },
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
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <p className="text-sm font-bold text-gray-800">What happened on brand's website?</p>
      </div>

      {/* Mini product preview with image */}
      <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
        {order.product_image && !imgErr ? (
          <img
            src={order.product_image}
            alt={order.product_name}
            className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-gray-200"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
            <ShoppingBag className="w-4 h-4 text-red-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800 line-clamp-1">{order.product_name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {order.brand_name} · PKR {parseFloat(order.total_price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Reason options */}
      <div className="space-y-2">
        {[
          { val: "cancelled", label: "I cancelled the order",   desc: "Order removed from records",      Icon: X              },
          { val: "refunded",  label: "I received a refund",     desc: "Amount marked as refunded",       Icon: RotateCcw      },
          { val: "exchanged", label: "I exchanged the product", desc: "Select new product you received", Icon: ArrowLeftRight },
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
        className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:shadow-lg active:scale-95"
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

// ── Step 2 (Exchange only): Pick new product with sub-category filter
function ExchangeProductPicker({ oldOrder, onProductSelected, onBack }) {
  const [search,    setSearch]    = useState("");
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [fetchErr,  setFetchErr]  = useState("");
  const [activeCat, setActiveCat] = useState("all");

  useEffect(() => {
    setLoading(true);
    setFetchErr("");

    // Fetch ALL approved products — simplest approach, always works
    // User can search by name or filter by sub-category
    fetch(`${BASE}/api/products`)
      .then(r => { if (!r.ok) throw new Error("API error"); return r.json(); })
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
        if (list.length === 0) setFetchErr("No products available.");
      })
      .catch(() => {
        setProducts([]);
        setFetchErr("Could not load products. Check connection.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Build sub-category tabs from loaded products
  const subCats = React.useMemo(() => {
    const map = new Map();
    products.forEach(p => {
      if (p.sub_category_id && p.sub_category_name)
        map.set(String(p.sub_category_id), p.sub_category_name);
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [products]);

  const filtered = products.filter(p => {
    const name  = (p.product_name || p.name || "").toLowerCase();
    const brand = (p.brand || p.brand_name || "").toLowerCase();
    const q     = search.toLowerCase();
    const matchSearch = !search || name.includes(q) || brand.includes(q);
    const matchCat = activeCat === "all" || String(p.sub_category_id) === activeCat;
    return matchSearch && matchCat;
  }).slice(0, 30);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div>
          <p className="text-sm font-bold text-gray-800">Which product did you receive?</p>
          <p className="text-[10px] text-gray-400">From {oldOrder.brand_name}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by product or brand name…"
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-200 bg-gray-50"
        />
      </div>

      {/* Sub-category filter tabs */}
      {subCats.length > 0 && (
        <div
          className="flex gap-1.5 overflow-x-auto pb-1.5 mb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            onClick={() => setActiveCat("all")}
            className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold transition-all"
            style={activeCat === "all"
              ? { background: "linear-gradient(135deg,#DC2626,#EA580C)", color: "#fff" }
              : { background: "#f3f4f6", color: "#6b7280" }}
          >
            All
          </button>
          {subCats.map(sc => (
            <button
              key={sc.id}
              onClick={() => setActiveCat(sc.id)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all"
              style={activeCat === sc.id
                ? { background: "linear-gradient(135deg,#DC2626,#EA580C)", color: "#fff" }
                : { background: "#f3f4f6", color: "#6b7280" }}
            >
              {sc.name}
            </button>
          ))}
        </div>
      )}

      {/* Product list */}
      <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: "min(280px, 40vh)" }}>
        {loading ? (
          <div className="py-10 text-center">
            <Loader2 className="w-5 h-5 text-red-400 animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-400">Loading products…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center px-4">
            <Package className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-xs text-gray-400">
              {fetchErr || (search ? `No results for "${search}"` : "No products in this category")}
            </p>
          </div>
        ) : (
          filtered.map(p => {
            const pid  = p.id || p.product_id;
            const name = p.product_name || p.name;
            const img  = p.image && p.image.startsWith("http") ? p.image : null;
            return (
              <button
                key={pid}
                onClick={() => onProductSelected(p)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-white hover:border-red-200 hover:bg-red-50 active:bg-red-100 transition-all text-left"
              >
                <div className="w-10 h-12 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
                  {img ? (
                    <img
                      src={img}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <Package className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">{name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.brand || p.brand_name}</p>
                  {p.sub_category_name && (
                    <p className="text-[10px] text-purple-500 font-semibold">{p.sub_category_name}</p>
                  )}
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
  const cfg        = STATUS_CFG[order.status] || STATUS_CFG.reported;
  const Icon       = cfg.icon;
  const isInactive = CLOSED_ST.includes(order.status);
  const [imgErr,   setImgErr] = useState(false);

  return (
    <div className={`rounded-2xl border p-3 transition-all ${
      isInactive ? "opacity-60 bg-gray-50 border-gray-100" : "bg-white border-gray-100 shadow-sm"
    }`}>
      <div className="flex items-start gap-3">

        {/* Product image */}
        <div className="flex-shrink-0">
          {order.product_image && !imgErr ? (
            <img
              src={order.product_image}
              alt={order.product_name}
              className={`w-14 h-14 rounded-xl object-cover border ${
                isInactive ? "border-gray-200 grayscale opacity-60" : "border-gray-100"
              }`}
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              isInactive ? "bg-gray-100" : "bg-red-50"
            }`}>
              <ShoppingBag className={`w-6 h-6 ${isInactive ? "text-gray-300" : "text-red-400"}`} />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-bold line-clamp-2 leading-tight ${
              isInactive ? "text-gray-400 line-through" : "text-gray-800"
            }`}>
              {order.product_name}
            </p>
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${cfg.bg} ${cfg.color}`}>
              <Icon className="w-2.5 h-2.5" />
              {cfg.label}
            </span>
          </div>

          <p className="text-[11px] text-gray-400 mt-0.5">{order.brand_name}</p>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs font-extrabold ${isInactive ? "text-gray-400 line-through" : "text-gray-800"}`}>
              PKR {parseFloat(order.total_price).toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-400">×{order.quantity}</span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-400">{fmtDate(order.created_at)}</span>
          </div>

          {/* Refunded amount */}
          {order.status === "refunded" && order.refunded_amount && (
            <p className="text-[10px] text-orange-500 font-semibold mt-0.5">
              Refunded: PKR {parseFloat(order.refunded_amount).toLocaleString()}
            </p>
          )}

          {/* Closed timestamp */}
          {isInactive && order.cancelled_at && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)} on {fmtDate(order.cancelled_at)}
            </p>
          )}

          {/* Action button — active orders only */}
          {!isInactive && (
            <button
              onClick={() => onReportIssue(order)}
              className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-200 text-red-600 text-[11px] font-bold hover:bg-red-50 active:bg-red-100 transition-colors"
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

  const [step,            setStep]            = useState("list"); // list | reason | exchange_pick
  const [open,            setOpen]            = useState(false);
  const [orders,          setOrders]          = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [activeOrder,     setActiveOrder]     = useState(null);   // order being actioned
  const [pendingExchange, setPendingExchange] = useState(null);   // saved for exchange — NOT voided yet
  const [exchangeProduct, setExchangeProduct] = useState(null);   // triggers BuyNowModal
  const [submitting,      setSubmitting]      = useState(false);
  const [toast,           setToast]           = useState("");

  const activeCount = orders.filter(o => !CLOSED_ST.includes(o.status)).length;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const resetToList = () => {
    setStep("list");
    setActiveOrder(null);
    setPendingExchange(null);
  };

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

  useEffect(() => { if (open)     fetchOrders(); }, [open, fetchOrders]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (user?.id) fetchOrders(); }, [user?.id]);

  // ── Cancel / Refund ─────────────────────────────────────────────
  const handleReasonConfirm = async (reason) => {
    // Exchange → save order, go to product picker — do NOT void yet
    if (reason === "exchanged") {
      setPendingExchange(activeOrder);
      setStep("exchange_pick");
      return;
    }

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
        o.id === activeOrder.id
          ? { ...o, status: reason, cancelled_at: new Date().toISOString(), refunded_amount: data.refunded_amount }
          : o
      ));
      showToast(reason === "cancelled" ? "Order cancelled ✓" : "Refund recorded ✓");
      resetToList();
    } catch (err) { showToast(err.message); }
    finally       { setSubmitting(false); }
  };

  // ── Exchange: new product selected — NOW void old + open BuyNowModal
  const handleExchangeProductSelected = async (newProduct) => {
    const orderToVoid = pendingExchange || activeOrder;
    setSubmitting(true);
    try {
      // 1. Void old order in Khareedlo + POS
      const res  = await fetch(`${BASE}/api/orders/${orderToVoid.id}/cancel`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reason: "exchanged", customer_id: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      // 2. Update old order locally
      setOrders(prev => prev.map(o =>
        o.id === orderToVoid.id
          ? { ...o, status: "exchanged", cancelled_at: new Date().toISOString() }
          : o
      ));

      // 3. Open BuyNowModal for new product → creates new order + new POS entry
      setExchangeProduct({
        ...newProduct,
        id:         newProduct.id || newProduct.product_id,
        title:      newProduct.product_name || newProduct.name,
        brand_id:   orderToVoid.brand_id,
        brand:      orderToVoid.brand_name,
        brand_name: orderToVoid.brand_name,
      });

      setOpen(false);
      resetToList();
    } catch (err) { showToast(err.message); }
    finally       { setSubmitting(false); }
  };

  // ── Exchange: new order saved via BuyNowModal ───────────────────
  const handleExchangeOrderSaved = () => {
    showToast("Exchange confirmed ✓ New order recorded");
    setExchangeProduct(null);
    setTimeout(() => fetchOrders(), 800);
  };

  if (!user) return null;

  const activeOrders = orders.filter(o => !CLOSED_ST.includes(o.status));
  const closedOrders = orders.filter(o =>  CLOSED_ST.includes(o.status));

  const panelTitle = step === "exchange_pick"
    ? "Select Exchange Product"
    : step === "reason"
      ? "Report an Issue"
      : "My Orders";

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

      <div
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[9999]"
        style={{ fontFamily: "'Sora','DM Sans',sans-serif" }}
      >
        {/* Toast */}
        {toast && (
          <div className="absolute bottom-full right-0 mb-3 whitespace-nowrap bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl pointer-events-none">
            {toast}
          </div>
        )}

        {/* Panel */}
        {open && (
          <>
            {/* Mobile backdrop — tap outside to close */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm sm:hidden z-[-1]"
              onClick={() => { setOpen(false); resetToList(); }}
            />

            <div
              className="absolute right-0 bottom-full mb-3 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
              style={{
                width: "min(calc(100vw - 24px), 360px)",
                maxHeight: "min(75vh, 600px)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}
              >
                <div className="flex items-center gap-2">
                  {step !== "list" && (
                    <button
                      onClick={step === "exchange_pick" ? () => setStep("reason") : resetToList}
                      className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-white" />
                    </button>
                  )}
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span className="text-sm font-extrabold text-white">{panelTitle}</span>
                  {step === "list" && activeCount > 0 && (
                    <span className="bg-white/25 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {activeCount} active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => { setOpen(false); resetToList(); }}
                  className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 active:bg-white/40 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto" style={{ maxHeight: "calc(min(75vh, 600px) - 56px)" }}>

                {/* ── STEP: List ── */}
                {step === "list" && (
                  <div className="p-3 space-y-2">
                    {loading ? (
                      <div className="py-12 flex flex-col items-center gap-3">
                        <Loader2 className="w-6 h-6 text-red-400 animate-spin" />
                        <p className="text-xs text-gray-400">Loading your orders…</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="py-14 text-center px-4">
                        <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-gray-500">No orders yet</p>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          Confirm a purchase via Khareedlo to track it here
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Active orders */}
                        {activeOrders.length > 0 && (
                          <>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 pt-1">
                              Active ({activeOrders.length})
                            </p>
                            {activeOrders.map(o => (
                              <OrderCard
                                key={o.id}
                                order={o}
                                onReportIssue={(order) => { setActiveOrder(order); setStep("reason"); }}
                              />
                            ))}
                          </>
                        )}

                        {/* Divider */}
                        {activeOrders.length > 0 && closedOrders.length > 0 && (
                          <div className="flex items-center gap-2 py-1">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Closed</span>
                            <div className="flex-1 h-px bg-gray-100" />
                          </div>
                        )}

                        {/* Closed orders */}
                        {closedOrders.length > 0 && (
                          <>
                            {activeOrders.length === 0 && (
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 pt-1">
                                Closed ({closedOrders.length})
                              </p>
                            )}
                            {closedOrders.map(o => (
                              <OrderCard
                                key={o.id}
                                order={o}
                                onReportIssue={(order) => { setActiveOrder(order); setStep("reason"); }}
                              />
                            ))}
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* ── STEP: Reason Picker ── */}
                {step === "reason" && activeOrder && (
                  <ReasonPicker
                    order={activeOrder}
                    onConfirm={handleReasonConfirm}
                    onBack={resetToList}
                    loading={submitting}
                  />
                )}

                {/* ── STEP: Exchange Product Picker ── */}
                {step === "exchange_pick" && (pendingExchange || activeOrder) && (
                  <ExchangeProductPicker
                    oldOrder={pendingExchange || activeOrder}
                    onProductSelected={handleExchangeProductSelected}
                    onBack={() => setStep("reason")}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Floating button */}
        <button
          onClick={() => { setOpen(o => !o); if (open) resetToList(); }}
          className="relative w-14 h-14 rounded-2xl text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #DC2626, #EA580C)",
            boxShadow: "0 8px 24px rgba(220,38,38,0.40)",
          }}
          aria-label="My Orders"
        >
          <ShoppingBag className="w-6 h-6" />
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-lg border-2 border-white">
              {activeCount > 9 ? "9+" : activeCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
}