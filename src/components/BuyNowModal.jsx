// src/components/BuyNowModal.jsx
// Shows after Buy Now redirect — asks if user completed purchase
// Quantity input → auto-calculates price → saves to platform_orders
// Sends to Loyverse (Alkaram) or Square (Limelight) POS automatically

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  ShoppingBag, X, Plus, Minus, CheckCircle,
  ExternalLink, PackageCheck, Loader2, Star,
} from "lucide-react";

// Brand logos/colors for the modal
const BRAND_THEME = {
  3: { color: "#5B1F7A", bg: "#F5F3FF", name: "Alkaram Studio",    pos: "Loyverse" },
  4: { color: "#B45309", bg: "#FFF7ED", name: "Limelight",          pos: "Square"   },
  1: { color: "#7C3A1E", bg: "#FEF3C7", name: "J. by Junaid Jamshed", pos: null    },
  2: { color: "#1A4731", bg: "#F0FDF4", name: "Zellbury",            pos: null     },
};

export default function BuyNowModal({ product, onClose, onOrderSaved }) {
  const { user } = useAuth();

  const [step,     setStep]     = useState("ask");     // "ask" | "confirm" | "success" | "declined"
  const [qty,      setQty]      = useState(1);
  const [saving,   setSaving]   = useState(false);
  const [result,   setResult]   = useState(null);

  const theme     = BRAND_THEME[product?.brand_id] || { color: "#DC2626", bg: "#FEF2F2" };
  const unitPrice = parseFloat(product?.price || 0);
  const total     = parseFloat((qty * unitPrice).toFixed(2));

  // Auto-close if no product
  useEffect(() => { if (!product) onClose?.(); }, [product]);

  const handleYes = () => setStep("confirm");

  const handleNo = () => {
    setStep("declined");
    setTimeout(() => onClose?.(), 1800);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id:  user?.id   || null,
          brand_id:     product.brand_id,
          product_id:   product.id || product.product_id,
          product_name: product.title || product.product_name || product.name,
          brand_name:   product.brand  || product.brand_name  || "",
          quantity:     qty,
          unit_price:   unitPrice,
          product_image: product?.image || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setResult(data);
      setStep("success");
      onOrderSaved?.(data);

      // Auto-close after 3.5s
      setTimeout(() => onClose?.(), 3500);
    } catch (err) {
      console.error("Order save error:", err);
      setSaving(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}>

      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        style={{ fontFamily: "'Sora','DM Sans',sans-serif" }}
      >
        {/* Color accent top bar */}
        <div className="h-1.5 w-full" style={{ background: theme.color }} />

        {/* ── Step 1: ASK ── */}
        {step === "ask" && (
          <div className="p-7">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0"
                  style={{ background: theme.color }}>
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5"
                    style={{ color: theme.color }}>Purchase Confirmation</p>
                  <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                    Did you complete your order?
                  </h3>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Product preview */}
            <div className="rounded-2xl p-4 mb-6 flex items-center gap-4"
              style={{ background: theme.bg }}>
              {(product.image && product.image !== "photos/") ? (
                <img
                  src={product.image?.startsWith("http") ? product.image : `https://khareedlo-backend-production.up.railway.app/${product.image}`}
                  alt={product.title || product.product_name}
                  className="w-16 h-20 object-cover rounded-xl flex-shrink-0 shadow-sm"
                  onError={e => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="w-16 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: theme.color + "20" }}>
                  <ShoppingBag className="w-7 h-7" style={{ color: theme.color }} />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: theme.color }}>
                  {product.brand || product.brand_name}
                  {theme.pos && (
                    <span className="ml-2 normal-case bg-white px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-sm">
                      via {theme.pos}
                    </span>
                  )}
                </p>
                <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                  {product.title || product.product_name || product.name}
                </p>
                <p className="text-base font-black mt-1" style={{ color: theme.color }}>
                  PKR {unitPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
              You were redirected to <strong style={{ color: theme.color }}>{product.brand || product.brand_name}'s</strong> website.
              Did you complete your purchase there?
            </p>

            <div className="flex gap-3">
              <button onClick={handleYes}
                className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}CC)` }}>
                ✅ Yes, I ordered!
              </button>
              <button onClick={handleNo}
                className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                ❌ No, not yet
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: QUANTITY CONFIRM ── */}
        {step === "confirm" && (
          <div className="p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                style={{ background: theme.color }}>
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: theme.color }}>
                  Order Details
                </p>
                <h3 className="text-lg font-extrabold text-gray-900">How many did you buy?</h3>
              </div>
            </div>

            {/* Product name */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-5">
              <p className="text-xs text-gray-400 font-semibold mb-1">Product</p>
              <p className="font-bold text-gray-800 text-sm">{product.title || product.product_name}</p>
              <p className="text-xs mt-1" style={{ color: theme.color }}>
                Unit Price: PKR {unitPrice.toLocaleString()}
              </p>
            </div>

            {/* Quantity control */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quantity</p>
              <div className="flex items-center justify-center gap-5">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all hover:shadow-md"
                  style={{ borderColor: theme.color, color: theme.color }}
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <span className="text-5xl font-black text-gray-900">{qty}</span>
                  <p className="text-xs text-gray-400 mt-1">item{qty !== 1 ? "s" : ""}</p>
                </div>

                <button
                  onClick={() => setQty(q => Math.min(20, q + 1))}
                  className="w-12 h-12 rounded-2xl text-white flex items-center justify-center transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ background: theme.color }}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="rounded-2xl p-4 mb-5 flex items-center justify-between"
              style={{ background: theme.bg }}>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Total Amount</p>
                <p className="text-2xl font-black" style={{ color: theme.color }}>
                  PKR {total.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{qty} × PKR {unitPrice.toLocaleString()}</p>
                {theme.pos && (
                  <p className="text-xs font-semibold mt-1" style={{ color: theme.color }}>
                    Will sync to {theme.pos}
                  </p>
                )}
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-xl disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}CC)` }}
            >
              {saving
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving order...</>
                : <><CheckCircle className="w-5 h-5" /> Confirm Order — PKR {total.toLocaleString()}</>
              }
            </button>

            <button onClick={() => setStep("ask")}
              className="w-full mt-2 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
              ← Go back
            </button>
          </div>
        )}

        {/* ── Step 3: SUCCESS ── */}
        {step === "success" && (
          <div className="p-7 text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl"
              style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}BB)` }}>
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Order Recorded!</h3>
            <p className="text-gray-500 text-sm mb-5">
              Your purchase has been saved to Khareedlo
              {theme.pos && <> and synced to <strong style={{ color: theme.color }}>{theme.pos} POS</strong></>}.
            </p>

            <div className="rounded-2xl p-4 mb-5" style={{ background: theme.bg }}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Product</span>
                <span className="font-semibold text-gray-800 text-right ml-4 max-w-[60%] line-clamp-1">
                  {product.title || product.product_name}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Quantity</span>
                <span className="font-semibold text-gray-800">{qty} item{qty !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-black text-lg" style={{ color: theme.color }}>
                  PKR {total.toLocaleString()}
                </span>
              </div>
              {result?.source && result.source !== "self_reported" && (
                <div className="mt-3 pt-3 border-t border-white/50 flex items-center gap-2 text-xs"
                  style={{ color: theme.color }}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Synced to {result.source === "loyverse" ? "Loyverse" : "Square"} POS
                  {result.pos_simulated && " (demo mode)"}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400">This window will close automatically…</p>
          </div>
        )}

        {/* ── Step 4: DECLINED ── */}
        {step === "declined" && (
          <div className="p-7 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No problem!</h3>
            <p className="text-sm text-gray-500">
              Come back and try again whenever you're ready. 😊
            </p>
          </div>
        )}
      </div>
    </div>
  );
}