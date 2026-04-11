import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAddToCart, disableAdd }) {
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (disableAdd) return; // 🚫 login required

    onAddToCart();
    setShowToast(true);

    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow hover:shadow-xl transition overflow-hidden group relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={`http://localhost:5000/${product.image}`}
            alt={product.title}
            onError={(e) => {
              e.currentTarget.src =
                "http://localhost:5000/photos/placeholder.png";
            }}
            className="h-56 w-full object-cover group-hover:scale-105 transition"
          />
        </Link>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 line-clamp-1">
            {product.title}
          </h3>

          <p className="text-gray-600 text-sm">{product.brand}</p>

          <p className="text-indigo-600 font-bold mt-1">
            PKR {product.price}
          </p>

          {product.trending && (
            <span className="inline-block mt-2 text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
              🔥 Trending
            </span>
          )}

          {onAddToCart && (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={disableAdd}
              className={`mt-4 w-full py-2 rounded-xl font-medium transition
                ${
                  disableAdd
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-[#f2976a] hover:from-red-700 hover:to-[#f2a77a] text-white"
                }
              `}
            >
              {disableAdd ? "Add to Cart" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>

      {/* ===== TOAST ===== */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="backdrop-blur-xl bg-white/90 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <div>
              <p className="font-semibold text-gray-800">Added to Cart</p>
              <p className="text-sm text-gray-500 line-clamp-1">
                {product.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
