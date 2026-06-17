// src/pages/ProductsPublic.jsx
// FIXED: Removed "Trending" from SORT_OPTIONS per requirement
// (Trending products should appear via Top Rated — not a separate filter)

import React, { useMemo, useState, useEffect, useContext } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useProductClickTracker } from "../hooks/useTracker";
import {
  Search, Star, ShoppingCart,
  ExternalLink, Package, X, ChevronDown, ArrowUpDown,
  CheckCircle, Lock, Sparkles, Filter,
} from "lucide-react";
import Footer from "../components/Footer";

// ── TRENDING removed per requirement — use Top Rated instead
const SORT_OPTIONS = [
  { key: "default",    label: "Featured"           },
  { key: "top_rated",  label: "⭐ Top Rated"       },
  { key: "price_asc",  label: "Price: Low → High"  },
  { key: "price_desc", label: "Price: High → Low"  },
  { key: "newest",     label: "Newest First"        },
];

const GENDERS = ["All", "Men", "Women", "Kids", "Unisex"];

function imgSrc(image) {
  if (!image || image === "photos/" || image.trim() === "") return null;
  if (image.startsWith("http")) return image;
  return `https://khareedlo-backend-production.up.railway.app/${image}`;
}

function ProductCard({ product, onAddToCart, canInteract, trackClick }) {
  const [redirectWarning, setRedirectWarning] = useState(null);
  const navigate = useNavigate();
  const [justAdded,    setJustAdded]    = useState(false);
  const [imgFailed,    setImgFailed]    = useState(false);
  const [showLoginTip, setShowLoginTip] = useState(false);

  const src  = imgSrc(product.image);
  const avg  = Number(product.avg_rating) || 0;
  const pid  = product.id || product.product_id;

  const goToProduct = () => { trackClick(product); navigate(`/product/${pid}`); };

  const handleCart = (e) => {
    e.stopPropagation();
    if (!canInteract) { setShowLoginTip(true); setTimeout(() => setShowLoginTip(false), 2500); return; }
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!canInteract) { setShowLoginTip(true); setTimeout(() => setShowLoginTip(false), 2500); return; }
    if (product.buy_now_link) setRedirectWarning({ brand: product.brand_name, link: product.buy_now_link });
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-pointer border border-white/60">

      {showLoginTip && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-gray-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-xl">
          🔒 Login to shop
        </div>
      )}

      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }} onClick={goToProduct}>
        {src && !imgFailed ? (
          <img
            src={src}
            alt={product.title || product.product_name}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent" />

        {avg >= 4 && (
          <div className="absolute top-3 left-3 bg-amber-400 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
            ⭐ Top Rated
          </div>
        )}
        {avg > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-gray-800">{avg.toFixed(1)}</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3">
          <span className="text-white font-black text-base drop-shadow-lg">
            PKR {Number(product.price).toLocaleString()}
          </span>
        </div>

        {product.buy_now_link && (
          <div className="absolute bottom-3 right-3 group/bn">
            <div
              onClick={handleBuyNow}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all opacity-0 group-hover:opacity-100 ${
                canInteract
                  ? "bg-white text-gray-900 hover:bg-gray-100 cursor-pointer"
                  : "bg-white/50 text-gray-400 cursor-not-allowed"
              }`}
            >
              {canInteract ? <><ExternalLink className="w-3 h-3" /> Buy Now</> : <><Lock className="w-3 h-3" /> Login</>}
            </div>
            {canInteract && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-gray-900 text-white text-[10px] rounded-xl px-3 py-2 shadow-2xl opacity-0 group-hover/bn:opacity-100 pointer-events-none transition-opacity z-30 text-center">
                <span className="text-amber-400 font-bold">⚠ Heads up!</span> You'll be taken to <strong>{product.brand_name}'s website</strong> to complete your purchase.
                <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">
          {product.brand || product.brand_name}
        </p>
        <h3
          className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug flex-1 cursor-pointer hover:text-red-600 transition-colors"
          onClick={goToProduct}
        >
          {product.title || product.product_name}
        </h3>

        {avg > 0 && (
          <div className="flex items-center gap-0.5 mt-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">({product.rating_count || 0})</span>
          </div>
        )}

        <button
          onClick={handleCart}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            justAdded
              ? "bg-emerald-500 text-white"
              : canInteract
                ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:shadow-lg"
                : "bg-gray-100 text-gray-400"
          }`}
        >
          {justAdded
            ? <><CheckCircle className="w-4 h-4" /> Added!</>
            : canInteract
              ? <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
              : <><Lock className="w-4 h-4" /> Login to Shop</>}
        </button>
      </div>
    </div>
  );
}

export default function ProductsPublic() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const trackClick  = useProductClickTracker();
  const { addToCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();

  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [q,           setQ]           = useState(searchParams.get("q") || "");
  const [gender,      setGender]      = useState("All");
  const [sortBy,      setSortBy]      = useState("default");
  const [priceMin,    setPriceMin]    = useState("");
  const [priceMax,    setPriceMax]    = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minRating,   setMinRating]   = useState(0);
  const [activeBrand,   setActiveBrand]   = useState("All");
  const [activeCategory, setActiveCategory] = useState("All"); // sub_category_id or "All"

  useEffect(() => {
    setLoading(true);
    fetch("https://khareedlo-backend-production.up.railway.app/api/products")
      .then(r => r.json())
      .then(d => { setProducts(Array.isArray(d) ? d : d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const brands = useMemo(() => {
    const set = new Set(products.map(p => p.brand || p.brand_name).filter(Boolean));
    return ["All", ...set];
  }, [products]);

  // Sub-categories available for the currently selected gender
  const subCategories = useMemo(() => {
    const genderFiltered = gender === "All"
      ? products
      : products.filter(p => (p.category || p.gender || "").toLowerCase() === gender.toLowerCase());
    const map = new Map();
    genderFiltered.forEach(p => {
      if (p.sub_category_id && p.sub_category_name)
        map.set(String(p.sub_category_id), p.sub_category_name);
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [products, gender]);

  const filtered = useMemo(() => {
    let data = [...products];

    if (q.trim()) {
      const lower = q.toLowerCase();
      data = data.filter(p =>
        (p.title || p.product_name || "").toLowerCase().includes(lower) ||
        (p.brand || p.brand_name || "").toLowerCase().includes(lower)
      );
    }

    if (activeBrand !== "All") {
      data = data.filter(p => (p.brand || p.brand_name) === activeBrand);
    }

    if (gender !== "All") {
      data = data.filter(p =>
        (p.category || p.gender || "").toLowerCase() === gender.toLowerCase()
      );
    }

    if (activeCategory !== "All") {
      data = data.filter(p => String(p.sub_category_id) === String(activeCategory));
    }

    if (priceMin !== "") data = data.filter(p => Number(p.price) >= Number(priceMin));
    if (priceMax !== "") data = data.filter(p => Number(p.price) <= Number(priceMax));
    if (minRating > 0)   data = data.filter(p => (Number(p.avg_rating) || 0) >= minRating);

    switch (sortBy) {
      case "price_asc":  data.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price_desc": data.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "top_rated":  data.sort((a, b) => (Number(b.avg_rating)||0) - (Number(a.avg_rating)||0)); break;
      case "newest":     data.sort((a, b) => (b.id||0) - (a.id||0)); break;
      default: break;
    }

    return data;
  }, [q, activeBrand, gender, activeCategory, sortBy, priceMin, priceMax, minRating, products]);

  const handleAddToCart = (product) => {
    if (!user) { navigate("/auth"); return; }
    addToCart(product);
    fetch("https://khareedlo-backend-production.up.railway.app/api/pos/track", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand_id: product.brand_id, product_id: product.id || product.product_id, action: "ADD_TO_CART" }),
    }).catch(() => {});
  };

  const activeFilterCount = [
    gender !== "All", sortBy !== "default",
    priceMin !== "", priceMax !== "", minRating > 0, activeBrand !== "All",
    activeCategory !== "All",
  ].filter(Boolean).length;

  const clearAll = () => {
    setGender("All"); setSortBy("default");
    setPriceMin(""); setPriceMax("");
    setMinRating(0); setActiveBrand("All"); setQ(""); setActiveCategory("All");
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-[#fff9f7] via-[#ffab81] to-[#ffb48f]">

      {/* ── Sticky Filter Bar ── */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search products or brands…"
                className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 transition"
              />
              {q && (
                <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
              </div>

              <button
                onClick={() => setShowFilters(f => !f)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  showFilters || activeFilterCount > 0
                    ? "text-white border-transparent shadow-lg shadow-red-200"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                }`}
                style={(showFilters || activeFilterCount > 0) ? { background: "linear-gradient(135deg, #DC2626, #EA580C)" } : {}}
              >
                <Filter className="w-4 h-4" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-50 space-y-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Gender</p>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map(g => (
                    <button key={g} onClick={() => { setGender(g); setActiveCategory("All"); }}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        gender === g ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      style={gender === g ? { background: "linear-gradient(135deg, #DC2626, #EA580C)" } : {}}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {subCategories.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sub-Category</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setActiveCategory("All")}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        activeCategory === "All" ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      style={activeCategory === "All" ? { background: "linear-gradient(135deg, #DC2626, #EA580C)" } : {}}>
                      All
                    </button>
                    {subCategories.map(sc => (
                      <button key={sc.id} onClick={() => setActiveCategory(sc.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                          activeCategory === sc.id ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        style={activeCategory === sc.id ? { background: "linear-gradient(135deg, #DC2626, #EA580C)" } : {}}>
                        {sc.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-6 items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price Range (PKR)</p>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={priceMin}
                      onChange={e => setPriceMin(e.target.value)}
                      className="w-28 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                    <span className="text-gray-300">—</span>
                    <input type="number" placeholder="Max" value={priceMax}
                      onChange={e => setPriceMax(e.target.value)}
                      className="w-28 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Min Rating</p>
                  <div className="flex gap-2">
                    {[0, 3, 3.5, 4, 4.5].map(r => (
                      <button key={r} onClick={() => setMinRating(r)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                          minRating === r ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-600 hover:bg-amber-100"
                        }`}>
                        {r === 0 ? "Any" : <><Star className="w-3 h-3" />{r}+</>}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button onClick={clearAll}
                    className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 underline">
                    <X className="w-3.5 h-3.5" /> Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {brands.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {brands.map(b => (
              <button key={b} onClick={() => setActiveBrand(b)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  activeBrand === b
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white/80 text-gray-600 border border-white hover:bg-white"
                }`}>
                {b}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {q ? `Results for "${q}"` : sortBy === "top_rated" ? "⭐ Top Rated Products" : "All Products"}
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          {!user && (
            <Link to="/auth"
              className="hidden sm:flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
              <Sparkles className="w-4 h-4" /> Login to Shop
            </Link>
          )}
        </div>

        {!user && (
          <div className="mb-6 bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm">
            <Lock className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-800">Login to add to cart and buy products</p>
              <p className="text-xs text-gray-500 mt-0.5">Browse freely — login when you're ready to shop</p>
            </div>
            <Link to="/auth"
              className="ml-auto flex-shrink-0 px-4 py-2 rounded-xl text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
              Login
            </Link>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-white/60 animate-pulse shadow-md">
                <div className="bg-gray-100" style={{ aspectRatio: "3/4" }} />
                <div className="p-4 space-y-2">
                  <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-9 bg-gray-100 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/80 flex items-center justify-center mb-5 shadow-sm">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">No products found</h3>
            <p className="text-gray-500 text-sm mb-6">Try adjusting your search or filters</p>
            <button onClick={clearAll}
              className="px-6 py-3 rounded-xl text-white text-sm font-bold shadow-lg"
              style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
              Clear All Filters
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
            {filtered.map(p => (
              <ProductCard
                key={p.id || p.product_id}
                product={p}
                canInteract={!!user}
                onAddToCart={handleAddToCart}
                trackClick={trackClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer />
  </>
  );
}