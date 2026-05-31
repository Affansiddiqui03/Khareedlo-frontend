// src/pages/cart.jsx
// UPDATED: BuyNowModal integrated — buy from cart also triggers order confirmation

import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import BuyNowModal from "../components/BuyNowModal";
import { useBuyNowModal } from "../hooks/useBuyNowModal";
import {
  ShoppingCart, Trash2, ExternalLink, ArrowLeft,
  Package, Store, ShoppingBag, Info, Sparkles, Lock,
} from "lucide-react";

const IMG_BASE = "http://localhost:5000";

function imgSrc(image) {
  if (!image || image === "photos/" || image.trim() === "") return null;
  if (image.startsWith("http")) return image;
  return `${IMG_BASE}/${image}`;
}

function CartItem({ item, onRemove, onBuy }) {
  const [removing, setRemoving] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const src = imgSrc(item.image);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.product_id), 320);
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex transition-all duration-300 ${removing ? "opacity-0 scale-95 translate-x-4" : "opacity-100"}`}>
      {/* Image */}
      <div className="w-28 sm:w-36 flex-shrink-0 bg-gray-50">
        {src && !imgFailed ? (
          <img src={src} alt={item.name} onError={() => setImgFailed(true)}
            className="w-full h-full object-cover" style={{ minHeight: 120 }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" style={{ minHeight: 120 }}>
            <Package className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Store className="w-3 h-3" /> {item.brand || "Brand"}
          </p>
          <Link to={`/product/${item.product_id}`}
            className="text-sm font-bold text-gray-900 hover:text-red-600 transition-colors leading-snug block line-clamp-2">
            {item.name}
          </Link>
          <p className="mt-2 text-lg font-black text-gray-900">
            PKR {Number(item.price).toLocaleString()}
          </p>
          <p className="text-[10px] text-amber-600 font-medium mt-0.5">Price may differ on brand website</p>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {item.buy_now_link ? (
            <button onClick={() => onBuy(item)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
              <ExternalLink className="w-3.5 h-3.5" /> Buy on Brand Website
            </button>
          ) : (
            <span className="text-[11px] text-gray-400 italic">No direct link available</span>
          )}
          <button onClick={handleRemove}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all">
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { cart, removeFromCart, clearCart, totalItems, totalPrice } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { modalProduct, triggerBuyNow, closeModal } = useBuyNowModal();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Login to View Cart</h2>
          <p className="text-gray-500 text-sm mb-6">Each customer has their own personal cart.</p>
          <button onClick={() => navigate("/auth")}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-lg"
            style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
            Login Now
          </button>
        </div>
      </div>
    );
  }

  const handleBuy = (item) => {
    if (user?.id) {
      fetch("http://localhost:5000/api/user/track/buy-redirect", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: user.id, product_id: item.product_id, product_name: item.name, brand_name: item.brand }),
      }).catch(() => {});
      fetch("http://localhost:5000/api/pos/track", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_id: item.brand_id, product_id: item.product_id, action: "BUY_NOW" }),
      }).catch(() => {});
    }
    // Trigger redirect + modal after 8s
    triggerBuyNow(item, item.buy_now_link);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-7">Hi <strong>{user.name}</strong>! Browse products and add your favourites here.</p>
          <Link to="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
            <Sparkles className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f] py-8 px-4"
        style={{ fontFamily: "'Sora','DM Sans',sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-red-500" />
                  My Cart
                  <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-black text-white"
                    style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
                    {totalItems}
                  </span>
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Saved for <strong>{user.name}</strong></p>
              </div>
            </div>
            <button onClick={() => { if (window.confirm("Clear all items?")) clearCart(); }}
              className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <CartItem key={item.product_id} item={item} onRemove={removeFromCart} onBuy={handleBuy} />
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
                <h3 className="text-base font-extrabold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                  {cart.map(item => (
                    <div key={item.product_id} className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {imgSrc(item.image) ? (
                          <img src={imgSrc(item.image)} alt="" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = "none"; }} />
                        ) : <Package className="w-4 h-4 text-gray-300 m-auto mt-2.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-400">{item.brand}</p>
                      </div>
                      <p className="text-xs font-bold text-gray-900 flex-shrink-0">PKR {Number(item.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Items ({totalItems})</span>
                    <span className="font-semibold">PKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Tap <strong>Buy on Brand Website</strong> on each product to complete your purchase.
                    A confirmation popup will appear after your purchase.
                  </p>
                </div>

                <Link to="/products"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Sparkles className="w-4 h-4" /> Add More Products
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-4 flex flex-wrap items-center gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600"><span className="text-lg">🔒</span><span>Your cart is private</span></div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><span className="text-lg">🛍️</span><span>Redirects to official brand websites</span></div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><span className="text-lg">📊</span><span>Orders tracked in brand dashboard</span></div>
          </div>
        </div>
      </div>

      {/* BuyNow Modal */}
      {modalProduct && <BuyNowModal product={modalProduct} onClose={closeModal} />}
    </>
  );
}