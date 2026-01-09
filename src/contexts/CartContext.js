import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const LS_KEY = "khareedlo_cart_v1";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState(null); // { code, type: 'percent' | 'flat', value }

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      setCart(Array.isArray(saved) ? saved : []);
    } catch {
      setCart([]);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }, [cart]);

  // Helpers
  const normalizeId = (p) => p.id || `${p.name || "item"}-${p.image || "img"}`;

  const addToCart = (product, qty = 1) => {
    const id = normalizeId(product);
    setCart((prev) => {
      const exists = prev.find((i) => i.id === id);
      if (exists) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: Math.min(99, (i.qty || 1) + qty) } : i
        );
      }
      return [
        ...prev,
        {
          id,
          name: product.name || product.title || "Product",
          price: Number(product.price || 0),
          image: product.image || product.thumbnail,
          brand: product.brand || product.brandName,
          sku: product.sku,
          qty: Math.min(99, qty || 1),
        },
      ];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const inc = (id) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, i.qty + 1) } : i))
    );
  };

  const dec = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  // Pricing
  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0),
    [cart]
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === "percent") return Math.round((subtotal * coupon.value) / 100);
    if (coupon.type === "flat") return Math.min(subtotal, coupon.value);
    return 0;
  }, [coupon, subtotal]);

  // Simple shipping mock: free over 5000, else 250
  const shipping = useMemo(() => (subtotal - discount > 5000 ? 0 : cart.length ? 250 : 0), [subtotal, discount, cart.length]);

  const grandTotal = useMemo(() => Math.max(0, subtotal - discount + shipping), [subtotal, discount, shipping]);

  // Coupon mock
  const applyCoupon = (code) => {
    const c = (code || "").trim().toUpperCase();
    if (!c) return { ok: false, msg: "Enter a coupon code" };

    if (c === "WELCOME10") {
      setCoupon({ code: c, type: "percent", value: 10 });
      return { ok: true, msg: "10% off applied!" };
    }
    if (c === "FLAT500") {
      setCoupon({ code: c, type: "flat", value: 500 });
      return { ok: true, msg: "PKR 500 off applied!" };
    }
    return { ok: false, msg: "Invalid coupon" };
  };

  const removeCoupon = () => setCoupon(null);

  const value = {
    cart,
    addToCart,
    updateQty,
    inc,
    dec,
    removeFromCart,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    shipping,
    grandTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
