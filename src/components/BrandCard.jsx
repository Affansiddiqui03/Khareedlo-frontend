// src/components/BrandCard.jsx  — REPLACE completely
// Adds: brand rating popup (once per user), avg rating display

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Building2, ShieldCheck } from "lucide-react";
import RatingPopup from "./RatingPopup";
import { useAuth } from "../contexts/AuthContext";

import zellburyLogo  from "../assets/brand4.jpeg";
import jLogo         from "../assets/brand2.png";
import alkaramLogo   from "../assets/brand3.png";
import limelightLogo from "../assets/brand1.jpg";

const HARDCODED_LOGOS = {
  "J. By Junaid Jamshed": jLogo,
  "Alkaram":  alkaramLogo,
  "Zellbury": zellburyLogo,
  "Limelight": limelightLogo,
};

const GRADIENTS = [
  "from-red-300 to-amber-200",
  "from-purple-300 to-pink-200",
  "from-green-300 to-teal-200",
  "from-blue-300 to-indigo-200",
  "from-orange-300 to-yellow-200",
  "from-rose-300 to-red-200",
];

function getBrandGradient(name) {
  if (!name) return GRADIENTS[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

function getInitials(name) {
  return (name || "?").split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function StarDisplay({ rating, count }) {
  const r = Number(rating) || 0;
  return (
    <div className="flex items-center gap-0.5 mt-1">
      {[1,2,3,4,5].map(s => (
        <Star key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(r) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />
      ))}
      <span className="text-xs text-gray-500 ml-1 font-medium">{r > 0 ? r.toFixed(1) : "—"}</span>
      {count > 0 && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  );
}

export default function BrandCard({ brand }) {
  const { user } = useAuth();
  const [showRating,   setShowRating]   = useState(false);
  const [avgRating,    setAvgRating]    = useState(Number(brand.rating) || 0);
  const [ratingCount,  setRatingCount]  = useState(0);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [ratingChecked,setRatingChecked]= useState(false);

  const brandId = brand.id || brand.brand_id;

  useEffect(() => {
    if (!brandId) return;
    const url = user?.id
      ? `https://khareedlo-backend-production.up.railway.app/api/ratings/brand/${brandId}?customer_id=${user.id}`
      : `https://khareedlo-backend-production.up.railway.app/api/ratings/brand/${brandId}`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.avg_rating > 0) setAvgRating(data.avg_rating);
        setRatingCount(data.rating_count || 0);
        setAlreadyRated(!!data.user_rating);
        setRatingChecked(true);
      })
      .catch(() => setRatingChecked(true));
  }, [brandId, user?.id]);

  const handleRatingSubmit = async (stars, endpoint, body) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, customer_id: user.id }),
    });
    const data = await res.json();

    if (data.already_rated) { setAlreadyRated(true); return; }
    if (data.success) {
      setAlreadyRated(true);
      setAvgRating(prev => {
        const newTotal = prev * ratingCount + stars;
        return parseFloat((newTotal / (ratingCount + 1)).toFixed(1));
      });
      setRatingCount(c => c + 1);
    }
  };

  const hardcodedLogo = HARDCODED_LOGOS[brand.name];
  const dynamicLogo   = brand.logo ? `https://khareedlo-backend-production.up.railway.app/${brand.logo}` : null;
  const logoSrc       = hardcodedLogo || dynamicLogo;
  const gradient      = getBrandGradient(brand.name);

  return (
    <>
      <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
        {/* Banner */}
        <div className={`h-28 bg-gradient-to-br ${gradient} relative`} />

        <div className="relative px-5 pb-6">
          {/* Logo */}
          <div className="-mt-10 bg-white w-20 h-20 rounded-2xl shadow-md flex items-center justify-center overflow-hidden border-2 border-white">
            {logoSrc ? (
              <img src={logoSrc} alt={brand.name} className="w-full h-full object-contain"
                onError={e => { e.target.style.display = "none"; }} />
            ) : null}
            {!logoSrc && (
              <div className={`w-full h-full flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br ${gradient}`}>
                {getInitials(brand.name)}
              </div>
            )}
          </div>

          <h3 className="mt-3 text-base font-bold text-gray-900 leading-tight">{brand.name}</h3>

          {brand.city && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> {brand.city}
            </p>
          )}

          {/* Stars */}
          <StarDisplay rating={avgRating} count={ratingCount} />

          {/* Rate button */}
          {user?.id && ratingChecked && !alreadyRated && (
            <button
              onClick={() => setShowRating(true)}
              className="mt-2 text-xs text-amber-500 hover:text-amber-600 font-semibold flex items-center gap-1"
            >
              <Star className="w-3 h-3" /> Rate this brand
            </button>
          )}
          {user?.id && alreadyRated && (
            <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> You rated this brand
            </p>
          )}

          {brand.description && (
            <p className="text-xs text-gray-400 mt-2 line-clamp-2">{brand.description}</p>
          )}

          <div className="mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-emerald-600 font-medium">Verified Brand</span>
          </div>

          <Link
            to={`/brands/${brandId}`}
            className="block mt-4 text-center bg-gradient-to-r from-red-600 to-orange-400 hover:from-red-700 hover:to-orange-500 transition-colors text-white py-2.5 rounded-xl font-semibold text-sm"
          >
            View Brand
          </Link>
        </div>
      </div>

      {/* Rating Popup */}
      {showRating && (
        <RatingPopup
          type="brand"
          id={brandId}
          name={brand.name}
          onClose={() => setShowRating(false)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </>
  );
}