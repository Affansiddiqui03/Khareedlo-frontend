// src/pages/BrandDetails.jsx
// FIXED:
// 1. disableAdd={!user} now passed to every ProductCard — guests see disabled button
// 2. New/unknown brand hero: gradient fallback + initials logo instead of broken <img>
// 3. Loading replaced with skeleton UI (not plain "Loading...")
// 4. Footer added

import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";
import { brandAssets } from "../data/brandAssets";
import ProductCard from "../components/ProductCard";
import RatingPopup from "../components/RatingPopup";
import Footer from "../components/Footer";
import {
  Star, Building2, Globe, ShieldCheck, Package,
} from "lucide-react";
import { useBrandVisitTracker } from "../hooks/useTracker";

// ── Brand color map for fallback gradient ─────────────────────
const BRAND_GRADIENTS = [
  "from-red-600 to-orange-500",
  "from-purple-600 to-indigo-500",
  "from-emerald-600 to-teal-500",
  "from-amber-600 to-yellow-500",
  "from-blue-600 to-cyan-500",
];
function brandGradient(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return BRAND_GRADIENTS[Math.abs(h) % BRAND_GRADIENTS.length];
}
function getInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function StarDisplay({ rating, count }) {
  const r = Number(rating) || 0;
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= Math.round(r) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
      <span className="text-sm font-semibold text-gray-700 ml-1">{r > 0 ? r.toFixed(1) : "—"}</span>
      {count > 0 && <span className="text-sm text-gray-400">({count} ratings)</span>}
    </div>
  );
}

export default function BrandDetails() {
  const { id } = useParams();
  const brandId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useContext(CartContext);

  const [brand,           setBrand]          = useState(null);
  const [products,        setProducts]       = useState([]);
  const [categories,      setCategories]     = useState([]);
  const [subCategories,   setSubCategories]  = useState([]);
  const [activeCategory,  setActiveCat]      = useState(null);
  const [activeSubCat,    setActiveSubCat]   = useState(null);
  const [loading,         setLoading]        = useState(true);

  // Rating
  const [showRating,    setShowRating]    = useState(false);
  const [avgRating,     setAvgRating]     = useState(0);
  const [ratingCount,   setRatingCount]   = useState(0);
  const [alreadyRated,  setAlreadyRated]  = useState(false);
  const [ratingChecked, setRatingChecked] = useState(false);

  // ── Fetch brand + products ────────────────────────────────
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:5000/api/brands/${brandId}`).then(r => r.json()),
      fetch(`http://localhost:5000/api/products/brand/${brandId}/seo`).then(r => r.json()),
    ])
      .then(([brandData, productData]) => {
        setBrand(brandData);
        setProducts(Array.isArray(productData) ? productData : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [brandId]);

  // ── Fetch categories ──────────────────────────────────────
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/brand/${brandId}/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, [brandId]);

  // ── Fetch sub-categories ──────────────────────────────────
  useEffect(() => {
    if (!activeCategory) return;
    fetch(`http://localhost:5000/api/products/brand/${brandId}/subcategories/${activeCategory}`)
      .then(r => r.json())
      .then(setSubCategories)
      .catch(() => {});
  }, [activeCategory, brandId]);

  useBrandVisitTracker(brandId, brand?.name);

  // ── Brand rating ──────────────────────────────────────────
  useEffect(() => {
    if (!brandId) return;
    const url = user?.id
      ? `http://localhost:5000/api/ratings/brand/${brandId}?customer_id=${user.id}`
      : `http://localhost:5000/api/ratings/brand/${brandId}`;
    fetch(url).then(r => r.json()).then(data => {
      if (data.avg_rating > 0) setAvgRating(data.avg_rating);
      setRatingCount(data.rating_count || 0);
      setAlreadyRated(!!data.user_rating);
      setRatingChecked(true);
    }).catch(() => setRatingChecked(true));
  }, [brandId, user?.id]);

  const normalizedProducts = useMemo(() =>
    Array.isArray(products) ? products.map(p => ({
      ...p,
      id: p.id || p.product_id,
      product_id: p.id || p.product_id,
      title: p.name || p.product_name || p.title,
      product_name: p.name || p.product_name || p.title,
      brand: brand?.name || "",
      brand_name: brand?.name || "",
      brand_id: brandId,
    })) : [],
  [products, brand, brandId]);

  const filteredProducts = useMemo(() =>
    normalizedProducts.filter(p => {
      if (activeCategory && p.category_id !== activeCategory) return false;
      if (activeSubCat && p.sub_category_id !== activeSubCat) return false;
      return true;
    }),
  [normalizedProducts, activeCategory, activeSubCat]);

  const handleRatingSubmit = async (stars, endpoint, body) => {
    const res = await fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, customer_id: user.id }),
    });
    const data = await res.json();
    if (data.already_rated) { setAlreadyRated(true); return; }
    if (data.success) {
      setAlreadyRated(true);
      setAvgRating(prev => parseFloat(((prev * ratingCount + stars) / (ratingCount + 1)).toFixed(1)));
      setRatingCount(c => c + 1);
    }
  };

  // ── SKELETON LOADING ──────────────────────────────────────
  if (loading) return (
    <div className="bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f] min-h-screen pb-20">
      {/* Hero skeleton */}
      <div className="relative h-[420px] bg-gray-200 animate-pulse">
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gray-300" />
            <div className="space-y-3">
              <div className="h-10 w-64 bg-gray-300 rounded-xl" />
              <div className="h-4 w-48 bg-gray-300 rounded-xl" />
              <div className="flex gap-1">{[1,2,3,4,5].map(i=><div key={i} className="w-5 h-5 bg-gray-300 rounded-full"/>)}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Products skeleton */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid lg:grid-cols-4 gap-12">
        <div className="bg-white rounded-3xl h-80 animate-pulse" />
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!brand) return (
    <div className="py-20 text-center">
      <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <p className="text-gray-500 font-semibold">Brand not found</p>
    </div>
  );

  // ── ASSET RESOLUTION (fallback for new/unknown brands) ────
  const assets         = brandAssets[brand.name] || {};
  const hasBanner      = !!assets.banner;
  const hasLogo        = !!assets.logo;
  const grad           = brandGradient(brand.name);
  const initials       = getInitials(brand.name);

  return (
    <div className="bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f] min-h-screen pb-20">

      {/* ── HERO ── */}
      <div className="relative h-[420px]">

        {/* Banner — use asset image OR gradient fallback */}
        {hasBanner ? (
          <img
            src={assets.banner}
            alt="brand banner"
            className="w-full h-full object-cover"
            onError={e => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.classList.add("bg-gradient-to-br", ...grad.split(" "));
            }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${grad}`} />
        )}

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 text-white flex-wrap">

            {/* Logo — asset or initials fallback */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/20 flex-shrink-0 bg-white/10">
              {hasLogo ? (
                <img
                  src={assets.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  onError={e => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl font-black text-white" style="background:rgba(255,255,255,0.2)">${initials}</div>`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white"
                  style={{ background: "rgba(255,255,255,0.2)" }}>
                  {initials}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-4xl sm:text-5xl font-extrabold">{brand.name}</h1>
                <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              </div>
              {brand.city && (
                <p className="text-white/60 text-sm flex items-center gap-1.5 mt-1">
                  <Building2 className="w-4 h-4" /> {brand.city}
                </p>
              )}
              {brand.description && (
                <p className="text-white/80 mt-2 text-sm line-clamp-2 max-w-2xl">{brand.description}</p>
              )}
              <div className="mt-3">
                <StarDisplay rating={avgRating} count={ratingCount} />
              </div>
            </div>

            {/* Rate button */}
            {user?.id && ratingChecked && !alreadyRated && (
              <button
                onClick={() => setShowRating(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition flex-shrink-0"
              >
                <Star className="w-4 h-4" /> Rate Brand
              </button>
            )}
            {user?.id && alreadyRated && (
              <span className="text-white/70 text-sm flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" /> You've rated this brand
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Website link */}
      {brand.website && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <a href={brand.website} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <Globe className="w-4 h-4" /> {brand.website}
          </a>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 mt-10 grid lg:grid-cols-4 gap-10">

        {/* Categories sidebar */}
        <aside className="bg-white rounded-3xl shadow-xl p-6 h-fit sticky top-20">
          <h3 className="font-bold mb-4 text-gray-900">Categories</h3>

          <button
            onClick={() => { setActiveCat(null); setActiveSubCat(null); }}
            className={`block w-full text-left py-2 px-3 rounded-lg text-sm mb-2 transition-colors ${
              !activeCategory ? "bg-red-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            All Products
          </button>

          {categories.map(cat => (
            <div key={cat.category_id}>
              <button
                onClick={() => { setActiveCat(cat.category_id); setActiveSubCat(null); }}
                className={`block w-full text-left py-2 px-3 rounded-lg text-sm mb-1 transition-colors ${
                  activeCategory === cat.category_id ? "bg-red-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {cat.category_name}
              </button>

              {activeCategory === cat.category_id && subCategories.length > 0 && (
                <div className="ml-4 mb-1 space-y-0.5">
                  {subCategories.map(sub => (
                    <button
                      key={sub.sub_category_id}
                      onClick={() => setActiveSubCat(sub.sub_category_id)}
                      className={`block text-sm py-1 px-2 rounded-lg w-full text-left transition-colors ${
                        activeSubCat === sub.sub_category_id
                          ? "text-red-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {sub.sub_category_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Products grid */}
        <main className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Products ({filteredProducts.length})
          </h2>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl py-16 text-center border border-gray-100">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No products in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  // FIX: disableAdd passed — guests see disabled state
                  disableAdd={!user}
                  onAddToCart={() => {
                    if (!user) { navigate("/auth"); return; }
                    fetch("http://localhost:5000/api/pos/track", {
                      method: "POST", headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ brand_id: brandId, product_id: p.id, action: "ADD_TO_CART" }),
                    }).catch(() => {});
                    addToCart(p);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Brand Rating Popup */}
      {showRating && (
        <RatingPopup
          type="brand"
          id={brandId}
          name={brand.name}
          onClose={() => setShowRating(false)}
          onSubmit={handleRatingSubmit}
        />
      )}

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}