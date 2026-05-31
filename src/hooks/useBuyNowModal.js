// src/hooks/useBuyNowModal.js
// Manages Buy Now flow: redirect → wait → show modal
// Used in ProductDetails.jsx and Cart.jsx

import { useState, useRef } from "react";

export function useBuyNowModal() {
  const [modalProduct, setModalProduct] = useState(null);
  const timerRef = useRef(null);

  // Call this INSTEAD of window.open directly
  const triggerBuyNow = (product, link) => {
    // Open brand website
    if (link) window.open(link, "_blank", "noopener,noreferrer");

    // Show modal after 8 seconds — gives user time to browse brand site
    // If they close the tab quickly or come back, modal will show
    timerRef.current = setTimeout(() => {
      setModalProduct(product);
    }, 8000); // 8 seconds
  };

  const closeModal = () => {
    setModalProduct(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const cancelTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return { modalProduct, triggerBuyNow, closeModal, cancelTimer };
}