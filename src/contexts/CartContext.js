// src/contexts/CartContext.js
// Cart is now synced to the backend DB so mobile & desktop always match.
// Flow:
//   Login  → fetch cart from /api/cart (DB)
//   Add/Remove/Clear → update local state → POST /api/cart/sync (DB)
//   Logout → clear local state (DB copy stays for next login)

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const BASE = "https://khareedlo-backend-production.up.railway.app";

// Read JWT token from wherever it's stored
function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

function authHeaders() {
  const token = getToken();
  return token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
               : { "Content-Type": "application/json" };
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Track latest cart for the sync debounce
  const cartRef = useRef(cart);
  cartRef.current = cart;

  // Debounce timer ref so we don't spam the backend on rapid changes
  const syncTimer = useRef(null);

  // ── Load cart from DB when user logs in ───────────────────
  useEffect(() => {
    if (!user?.id) {
      setCart([]);   // Guest / logged-out → empty
      return;
    }

    setCartLoading(true);
    fetch(`${BASE}/api/cart`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(data => setCart(Array.isArray(data) ? data : []))
      .catch(() => setCart([]))
      .finally(() => setCartLoading(false));
  }, [user?.id]);

  // ── Sync cart to DB whenever it changes (debounced 600ms) ─
  // This runs after any add/remove/clear so mobile & desktop stay in sync
  useEffect(() => {
    if (!user?.id) return;       // Don't sync guest cart
    if (cartLoading) return;     // Don't sync during initial load

    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      fetch(`${BASE}/api/cart/sync`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ cart: cartRef.current }),
      }).catch(() => {});  // Best-effort — local state is source of truth
    }, 600);

    return () => clearTimeout(syncTimer.current);
  }, [cart, user?.id]);   // eslint-disable-line react-hooks/exhaustive-deps

  // ── Add product ───────────────────────────────────────────
  const addToCart = (product) => {
    if (!user) return;

    const pid = String(product.product_id || product.id);

    setCart(prev => {
      if (prev.find(i => String(i.product_id) === pid)) return prev;  // already there

      return [
        ...prev,
        {
          product_id:   pid,
          name:         product.product_name || product.title || product.name || "Product",
          price:        Number(product.price || 0),
          image:        product.image || null,
          brand:        product.brand_name || product.brand || "",
          brand_id:     product.brand_id || null,
          buy_now_link: product.buy_now_link || product.brand_website || null,
          added_at:     Date.now(),
        },
      ];
    });
  };

  // ── Remove product ────────────────────────────────────────
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => String(i.product_id) !== String(productId)));
  };

  // ── Clear all ─────────────────────────────────────────────
  const clearCart = () => setCart([]);

  // ── Check membership ──────────────────────────────────────
  const isInCart = (productId) =>
    cart.some(i => String(i.product_id) === String(productId));

  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

  return (
    <CartContext.Provider value={{
      cart, cartLoading,
      addToCart, removeFromCart, clearCart,
      isInCart, totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };