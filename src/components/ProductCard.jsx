// src/components/ProductCard.jsx  — REPLACE completely
// Adds: star display, rating popup (once per user), proper image path, trending badge

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import RatingPopup from "./RatingPopup";
import { useAuth } from "../contexts/AuthContext";

function StarDisplay({ rating, count }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      {[1,2,3,4,5].map(s => (
        <Star key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />
      ))}
      {count > 0 && <span className="text-xs text-gray-400 ml-1">({count})</span>}
    </div>
  );
}

export default function ProductCard({ product, onAddToCart, disableAdd }) {
  const { user } = useAuth();
  const [showToast,   setShowToast]   = useState(false);
  const [showRating,  setShowRating]  = useState(false);
  const [avgRating,   setAvgRating]   = useState(product.avg_rating || 0);
  const [ratingCount, setRatingCount] = useState(product.rating_count || 0);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [ratingChecked, setRatingChecked] = useState(false);

  // Check if user already rated this product
  useEffect(() => {
    if (!user?.id || !product.id) return;
    fetch(`https://khareedlo-backend-production.up.railway.app/api/ratings/product/${product.id}?customer_id=${user.id}`)
      .then(r => r.json())
      .then(data => {
        setAvgRating(data.avg_rating || 0);
        setRatingCount(data.rating_count || 0);
        setAlreadyRated(!!data.user_rating);
        setRatingChecked(true);
      })
      .catch(() => setRatingChecked(true));
  }, [user?.id, product.id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disableAdd) return;
    onAddToCart();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    // After adding to cart, show rating popup if not yet rated (and user is logged in)
    if (user?.id && ratingChecked && !alreadyRated) {
      setTimeout(() => setShowRating(true), 600);
    }
  };

  const handleRatingSubmit = async (stars, endpoint, body) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, customer_id: user.id }),
    });
    const data = await res.json();

    if (data.already_rated) {
      setAlreadyRated(true);
      setShowRating(false);
      return;
    }

    if (data.success) {
      setAlreadyRated(true);
      setAvgRating(prev => {
        const newTotal = prev * ratingCount + stars;
        return parseFloat((newTotal / (ratingCount + 1)).toFixed(1));
      });
      setRatingCount(c => c + 1);
    }
  };

  // Resolve image src
  const imgSrc = product.image && product.image !== "photos/" && product.image !== ""
    ? product.image.startsWith("http")
      ? product.image
      : `https://khareedlo-backend-production.up.railway.app/${product.image}`
    : `https://khareedlo-backend-production.up.railway.app/photos/placeholder.png`;

  return (
    <>
      <div className="bg-white rounded-3xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
        <Link to={`/product/${product.id}`}>
          <div className="relative h-56 overflow-hidden">
            <img
              src={imgSrc}
              alt={product.title || product.product_name}
              onError={e => { e.currentTarget.src = "https://khareedlo-backend-production.up.railway.app/photos/placeholder.png"; }}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.trending && (
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                🔥 Trending
              </div>
            )}
            {/* Rating badge overlay */}
            {avgRating > 0 && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full shadow">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-gray-800">{Number(avgRating).toFixed(1)}</span>
              </div>
            )}
          </div>
        </Link>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 line-clamp-1 text-sm">
            {product.title || product.product_name}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">{product.brand || product.brand_name}</p>

          {/* Star display */}
          <StarDisplay rating={avgRating} count={ratingCount} />

          <p className="text-red-600 font-bold mt-2 text-sm">
            PKR {Number(product.price).toLocaleString()}
          </p>

          {/* Rate button (only if logged in and not yet rated) */}
          {user?.id && ratingChecked && !alreadyRated && (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); setShowRating(true); }}
              className="mt-2 text-xs text-amber-500 hover:text-amber-600 font-semibold flex items-center gap-1 transition-colors"
            >
              <Star className="w-3 h-3" /> Rate this product
            </button>
          )}
          {user?.id && alreadyRated && (
            <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> You rated this
            </p>
          )}

          {onAddToCart && (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={disableAdd}
              className={`mt-3 w-full py-2 rounded-xl font-semibold text-sm transition-all ${
                disableAdd
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-orange-400 hover:from-red-700 hover:to-orange-500 text-white shadow-sm hover:shadow-md"
              }`}
            >
              {disableAdd ? "Login to Add" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-3 border border-green-100">
          <span className="text-green-600 text-xl">✔</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Added to Cart</p>
            <p className="text-xs text-gray-500 line-clamp-1">{product.title || product.product_name}</p>
          </div>
        </div>
      )}

      {/* Rating Popup */}
      {showRating && (
        <RatingPopup
          type="product"
          id={product.id}
          name={product.title || product.product_name}
          onClose={() => setShowRating(false)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </>
  );
}