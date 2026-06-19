// src/contexts/CartContext.js
// PER-USER CART — each customer has their own cart keyed by user ID
// No quantity increase/decrease — just add & remove (redirect-based platform)

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Key is per-user so carts never mix
const cartKey = (userId) => userId ? `khareedlo_cart_${userId}` : null;

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Load this user's cart when user changes (login/logout/switch)
  useEffect(() => {
    const key = cartKey(user?.id);
    if (!key) {
      setCart([]);   // Guest — empty cart
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      setCart(Array.isArray(saved) ? saved : []);
    } catch {
      setCart([]);
    }
  }, [user?.id]);

  // Persist whenever cart changes
  useEffect(() => {
    const key = cartKey(user?.id);
    if (!key) return;   // Don't persist guest cart
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user?.id]);

  // ── Add product to cart (no duplicates — same product just stays) ──
  const addToCart = (product) => {
    if (!user) return;   // Must be logged in

    const pid = String(product.product_id || product.id);

    setCart((prev) => {
      const already = prev.find((i) => String(i.product_id) === pid);
      if (already) return prev;   // Already in cart, don't add again

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

  // ── Remove a product from cart ──
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => String(i.product_id) !== String(productId)));
  };

  // ── Clear full cart ──
  const clearCart = () => setCart([]);

  // ── Check if product is already in cart ──
  const isInCart = (productId) =>
    cart.some((i) => String(i.product_id) === String(productId));

  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };