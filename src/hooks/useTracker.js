// src/hooks/useTracker.js  — NEW FILE
// Drop this in src/hooks/useTracker.js
// Used by BrandDetails and ProductDetail pages to track visits automatically

import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const BASE = "http://localhost:5000/api/user";

// ── Track brand visit when component mounts ────────────────────
export function useBrandVisitTracker(brandId, brandName) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id || !brandId) return;

    fetch(`${BASE}/track/brand-visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: user.id,
        brand_id:    brandId,
        brand_name:  brandName || "",
      }),
    }).catch(() => {}); // silent — tracking should never break the UI
  }, [user?.id, brandId]);
}

// ── Track product click (call manually onClick) ─────────────────
export function useProductClickTracker() {
  const { user } = useAuth();

  const trackClick = (product) => {
    if (!user?.id || !product) return;
    fetch(`${BASE}/track/product-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id:  user.id,
        product_id:   product.id || product.product_id,
        product_name: product.product_name || product.title || product.name || "",
        brand_name:   product.brand || product.brand_name || "",
        brand_id:     product.brand_id || null,
        image:        product.image || null,
        price:        product.price || null,
      }),
    }).catch(() => {});
  };

  return trackClick;
}

// ── Track buy redirect (call on Buy Now click) ─────────────────
export function useBuyRedirectTracker() {
  const { user } = useAuth();

  const trackBuy = (product) => {
    if (!user?.id || !product) return;
    fetch(`${BASE}/track/buy-redirect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id:  user.id,
        product_id:   product.id || product.product_id,
        product_name: product.product_name || product.title || product.name || "",
        brand_name:   product.brand || product.brand_name || "",
      }),
    }).catch(() => {});
  };

  return trackBuy;
}