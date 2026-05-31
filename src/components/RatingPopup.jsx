// src/components/RatingPopup.jsx  — NEW FILE
// Professional one-time rating popup for products and brands

import React, { useState } from "react";
import { Star, X, CheckCircle } from "lucide-react";

export default function RatingPopup({ type, id, name, onClose, onSubmit }) {
  const [hovered, setHovered]   = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]         = useState(false);

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const endpoint = type === "brand"
        ? "http://localhost:5000/api/ratings/brand"
        : "http://localhost:5000/api/ratings/product";

      const body = type === "brand"
        ? { brand_id: id, rating: selected }
        : { product_id: id, rating: selected };

      // customer_id comes from parent via onSubmit
      await onSubmit(selected, endpoint, body);
      setDone(true);
      setTimeout(onClose, 1800);
    } catch {
      // already_rated handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 px-6 py-5 relative">
          <button onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
            Rate this {type === "brand" ? "Brand" : "Product"}
          </p>
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{name}</h3>
        </div>

        <div className="p-6">
          {done ? (
            <div className="flex flex-col items-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="font-bold text-gray-900">Thank you!</p>
              <p className="text-sm text-gray-500 mt-1">Your rating has been submitted.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 text-center mb-6">
                How would you rate your experience?
              </p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setSelected(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hovered || selected)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-100 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Label */}
              <p className={`text-center text-sm font-semibold mb-6 transition-all ${
                (hovered || selected) ? "text-amber-500" : "text-gray-300"
              }`}>
                {labels[hovered || selected] || "Select a rating"}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Maybe Later
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selected || submitting}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-bold disabled:opacity-40 transition-all hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, #E53E3E, #F97316)" }}
                >
                  {submitting ? "Submitting..." : "Submit Rating"}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">
                You can only rate once. This helps other shoppers discover the best {type === "brand" ? "brands" : "products"}.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}