// src/pages/ProductDetails.jsx
// UPDATED: BuyNowModal integrated — after Buy Now redirect, modal auto-appears after 8s

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import RatingPopup from "../components/RatingPopup";
import BuyNowModal from "../components/BuyNowModal";
import { useBuyNowModal } from "../hooks/useBuyNowModal";
import {
  Star, ShoppingCart, Heart, CheckCircle,
  ExternalLink, Tag, Store, Package, ChevronRight,
  Shield, RotateCcw, BadgeCheck, X, Lock, TrendingUp,
} from "lucide-react";

const IMG_BASE = "https://khareedlo-backend-production.up.railway.app";

function resolveImg(img) {
  if (!img || img === "photos/" || img.trim() === "") return null;
  if (img.startsWith("http")) return img; // Cloudinary URL
  if (img.startsWith("http")) return img;
  return `${IMG_BASE}/${img}`;
}

function StarRow({ rating, count, size = "sm" }) {
  const r  = Math.round(Number(rating) || 0);
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`${sz} ${s <= r ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
      {Number(rating) > 0 && <span className="ml-1 text-xs font-bold text-gray-700">{Number(rating).toFixed(1)}</span>}
      {count > 0 && <span className="text-[10px] text-gray-400">({count})</span>}
    </div>
  );
}

function ZoomImage({ src, alt }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  if (!src || failed) return (
    <div className="w-full rounded-3xl bg-gray-100 flex items-center justify-center shadow-xl" style={{ aspectRatio: "4/5" }}>
      <Package className="w-20 h-20 text-gray-300" />
    </div>
  );
  return (
    <>
      <div onClick={() => setOpen(true)} className="relative overflow-hidden rounded-3xl cursor-zoom-in bg-gray-50 shadow-2xl group" style={{ aspectRatio: "4/5" }}>
        <img src={src} alt={alt} onError={() => setFailed(true)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute bottom-4 right-4 bg-black/50 text-white text-[11px] px-3 py-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100">Click to zoom</span>
      </div>
      {open && (
        <div className="fixed inset-0 z-[500] bg-black/92 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setOpen(false)}>
          <button className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
          <img src={src} alt={alt} className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl" />
        </div>
      )}
    </>
  );
}

export default function ProductDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user }  = useAuth();
  const { modalProduct, triggerBuyNow, closeModal } = useBuyNowModal();

  const [product,      setProduct]      = useState(null);
  const [comparePool,  setComparePool]  = useState([]);
  const [compareId,    setCompareId]    = useState("");
  const [loading,      setLoading]      = useState(true);
  const [cartFlash,    setCartFlash]    = useState(false);
  const [showLogin,    setShowLogin]    = useState(false);
  const [wishlisted,   setWishlisted]   = useState(false);
  const [showRating,   setShowRating]   = useState(false);
  const [avgRating,    setAvgRating]    = useState(0);
  const [ratingCount,  setRatingCount]  = useState(0);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [ratingChecked,setRatingChecked]= useState(false);

  const compareProduct = comparePool.find(p => String(p.id || p.product_id) === String(compareId));

  useEffect(() => {
    setLoading(true);
    fetch(`${IMG_BASE}/api/products/${id}`).then(r => r.json()).then(d => { setProduct(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const gender = product.category || product.gender || "";
    fetch(`${IMG_BASE}/api/products`).then(r => r.json()).then(data => {
      const all = Array.isArray(data) ? data : data.products || [];
      setComparePool(all.filter(p => {
        if (String(p.id || p.product_id) === String(id)) return false;
        if (!gender) return true;
        return (p.category || p.gender || "").toLowerCase() === gender.toLowerCase();
      }));
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, id]);

  useEffect(() => {
    if (!user?.id || !product) return;
    fetch(`${IMG_BASE}/api/user/track/product-click`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: user.id, product_id: product.id, product_name: product.title || product.product_name || "", brand_name: product.brand || "", brand_id: product.brand_id || null, image: product.image || null, price: product.price || null }),
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, product?.id]);

  useEffect(() => {
    if (!id) return;
    const url = user?.id ? `${IMG_BASE}/api/ratings/product/${id}?customer_id=${user.id}` : `${IMG_BASE}/api/ratings/product/${id}`;
    fetch(url).then(r => r.json()).then(d => { setAvgRating(d.avg_rating || 0); setRatingCount(d.rating_count || 0); setAlreadyRated(!!d.user_rating); setRatingChecked(true); }).catch(() => setRatingChecked(true));
  }, [id, user?.id]);

  const handleAddToCart = () => {
    if (!user) { setShowLogin(true); return; }
    fetch(`${IMG_BASE}/api/pos/track`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand_id: product.brand_id, product_id: product.id, action: "ADD_TO_CART" }) }).catch(() => {});
    addToCart(product);
    setCartFlash(true);
    setTimeout(() => setCartFlash(false), 2200);
    if (user?.id && ratingChecked && !alreadyRated) setTimeout(() => setShowRating(true), 900);
  };

  const handleBuyNow = () => {
    if (!user) { setShowLogin(true); return; }
    fetch(`${IMG_BASE}/api/user/track/buy-redirect`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_id: user.id, product_id: product.id, product_name: product.title || "", brand_name: product.brand || "" }) }).catch(() => {});
    fetch(`${IMG_BASE}/api/pos/track`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand_id: product.brand_id, product_id: product.id, action: "BUY_NOW" }) }).catch(() => {});
    const link = product.buy_now_link || product.brand_website;

    // Show rating popup if not yet rated
    if (ratingChecked && !alreadyRated) {
      setShowRating(true);
      setTimeout(() => triggerBuyNow(product, link), 2000);
    } else {
      triggerBuyNow(product, link);
    }
  };

  const handleRatingSubmit = async (stars, endpoint, body) => {
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, customer_id: user.id }) });
    const data = await res.json();
    if (data.already_rated) { setAlreadyRated(true); return; }
    if (data.success) { setAlreadyRated(true); setAvgRating(prev => parseFloat(((prev * ratingCount + stars) / (ratingCount + 1)).toFixed(1))); setRatingCount(c => c + 1); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8FA]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-[3px] border-red-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading product…</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8F8FA]">
      <Package className="w-16 h-16 text-gray-200" />
      <p className="text-lg font-bold text-gray-500">Product not found</p>
      <Link to="/products" className="text-red-600 text-sm hover:underline">← Back to Products</Link>
    </div>
  );

  const title   = product.title || product.product_name || "Product";
  const src     = resolveImg(product.image);
  const hasLink = !!(product.buy_now_link || product.brand_website);
  const gender  = product.category || product.gender || "";
  const isTrend = Number(product.score) > 15;

  return (
    <div className="min-h-screen bg-[#F8F8FA]" style={{ fontFamily: "'Sora','DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-3">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-gray-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-gray-600">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium line-clamp-1 max-w-[220px]">{title}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          <div>
            <ZoomImage src={src} alt={title} />
            <div className="flex gap-2 mt-4 flex-wrap">
              {gender  && <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600">{gender}</span>}
              {isTrend && <span className="px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-xs font-bold text-red-600">🔥 Trending</span>}
            </div>
          </div>

          <div className="flex flex-col">
            <Link to={`/brands/${product.brand_id}`} className="inline-flex items-center gap-1.5 w-fit px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold hover:shadow-sm mb-4">
              <Store className="w-3.5 h-3.5" />{product.brand || product.brand_name}
            </Link>
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-gray-950 leading-tight tracking-tight">{title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <StarRow rating={avgRating} count={ratingCount} size="lg" />
              {user?.id && ratingChecked && !alreadyRated && (
                <button onClick={() => setShowRating(true)} className="flex items-center gap-1 text-[11px] font-bold text-amber-600 border border-amber-200 bg-amber-50 px-2.5 py-1 rounded-full hover:bg-amber-100">
                  <Star className="w-3 h-3" /> Rate this
                </button>
              )}
              {alreadyRated && <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold"><CheckCircle className="w-3.5 h-3.5" /> You rated this</span>}
            </div>
            <div className="mt-6 pb-6 border-b border-gray-100">
              <span className="text-4xl font-black text-gray-900">PKR {Number(product.price).toLocaleString()}</span>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 font-medium"><Tag className="w-3.5 h-3.5" /> Prices may differ on the brand's official website</p>
            </div>
            <p className="mt-5 text-gray-500 text-sm leading-relaxed">Crafted from premium quality materials with exceptional attention to detail. This piece blends modern design with enduring durability.</p>

            <div className="mt-7 space-y-3">
              <div className="flex gap-3">
                <button onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm transition-all ${user ? "text-white shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-0.5" : "bg-gray-100 text-gray-400"}`}
                  style={user ? { background: "linear-gradient(135deg, #DC2626, #EA580C)" } : {}}>
                  {cartFlash ? <><CheckCircle className="w-5 h-5" /> Added!</> : user ? <><ShoppingCart className="w-5 h-5" /> Add to Cart</> : <><Lock className="w-5 h-5" /> Login to Cart</>}
                </button>
                <button onClick={() => setWishlisted(w => !w)} className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${wishlisted ? "border-red-400 bg-red-50 text-red-500" : "border-gray-200 text-gray-300 hover:border-red-300"}`}>
                  <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
                </button>
              </div>
              {hasLink && (
                <div className="relative group/buynow">
                  <button onClick={handleBuyNow}
                    className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm border-2 transition-all ${user ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white hover:-translate-y-0.5" : "border-gray-200 text-gray-400"}`}>
                    {user ? <><ExternalLink className="w-4 h-4" /> Buy Now on Brand Website</> : <><Lock className="w-4 h-4" /> Login to Buy Now</>}
                  </button>
                  {/* Redirect warning tooltip */}
                  {user && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 shadow-2xl opacity-0 group-hover/buynow:opacity-100 pointer-events-none transition-opacity duration-200 z-20 text-center">
                      <span className="text-amber-400 font-bold">⚠ Heads up!</span> You'll be taken to <strong>{product.brand || "the brand"}'s official website</strong> to complete your purchase.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  )}
                </div>
              )}
              {!user && <p className="text-center text-xs text-red-500 font-medium">⚠ Please <button onClick={() => setShowLogin(true)} className="underline font-bold">login</button> to shop</p>}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-7">
              {[
                { icon: <Shield className="w-5 h-5" />, label: "Secure Platform", color: "text-blue-500 bg-blue-50" },
                { icon: <BadgeCheck className="w-5 h-5" />, label: "Verified Brand", color: "text-emerald-500 bg-emerald-50" },
                { icon: <RotateCcw className="w-5 h-5" />, label: "Easy Returns", color: "text-purple-500 bg-purple-50" },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${b.color}`}>{b.icon}</div>
                  <span className="text-[11px] text-gray-500 font-semibold leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-1">Compare with other {gender || ""} Products</h2>
          <p className="text-xs text-gray-400 mb-4 sm:mb-5">Comparing across all brands in the same category</p>
          {comparePool.length === 0 ? (
            <p className="text-sm text-gray-400">No other {gender} products available to compare.</p>
          ) : (
            <>
              <select value={compareId} onChange={e => setCompareId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 mb-5 sm:mb-7 cursor-pointer">
                <option value="">— Select a product to compare —</option>
                {comparePool.map(p => <option key={p.id || p.product_id} value={p.id || p.product_id}>{p.title || p.product_name} — PKR {Number(p.price).toLocaleString()}</option>)}
              </select>
              {compareProduct && (
                <>
                  {/* Mobile: card layout */}
                  <div className="sm:hidden space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[{img: src, name: title, label: "This Product"}, {img: resolveImg(compareProduct.image), name: compareProduct.title || compareProduct.product_name, label: "Compared"}].map((x, i) => (
                        <div key={i} className={`rounded-2xl p-3 text-center ${i === 0 ? "bg-red-50 border border-red-100" : "bg-gray-50 border border-gray-100"}`}>
                          <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${i === 0 ? "text-red-500" : "text-gray-400"}`}>{x.label}</p>
                          {x.img ? <img src={x.img} className="h-24 w-full object-cover rounded-xl mb-2" alt="" onError={e => e.currentTarget.style.display="none"} /> : <div className="h-24 bg-gray-100 rounded-xl mb-2 flex items-center justify-center"><Package className="w-6 h-6 text-gray-300" /></div>}
                          <p className="text-xs font-bold text-gray-700 line-clamp-2">{x.name}</p>
                        </div>
                      ))}
                    </div>
                    {[
                      {label: "Brand", v1: product.brand || product.brand_name, v2: compareProduct.brand || compareProduct.brand_name},
                      {label: "Price", v1: `PKR ${Number(product.price).toLocaleString()}`, v2: `PKR ${Number(compareProduct.price).toLocaleString()}`, bold: true},
                      {label: "Trending", v1: isTrend ? "🔥 Yes" : "—", v2: Number(compareProduct.score) > 15 ? "🔥 Yes" : "—"},
                    ].map(row => (
                      <div key={row.label} className="bg-gray-50 rounded-2xl p-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{row.label}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className={`bg-red-50 rounded-xl p-2.5 text-center text-xs ${row.bold ? "font-black text-orange-600" : "font-semibold text-gray-700"}`}>{row.v1}</div>
                          <div className={`bg-white rounded-xl p-2.5 text-center text-xs border border-gray-100 ${row.bold ? "font-black text-orange-600" : "font-semibold text-gray-700"}`}>{row.v2}</div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-gray-50 rounded-2xl p-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Rating</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-red-50 rounded-xl p-2.5 flex justify-center">{avgRating > 0 ? <StarRow rating={avgRating} count={ratingCount} /> : <span className="text-xs text-gray-400">No ratings</span>}</div>
                        <div className="bg-white rounded-xl p-2.5 border border-gray-100 flex justify-center">{(Number(compareProduct.avg_rating)||0) > 0 ? <StarRow rating={compareProduct.avg_rating} count={compareProduct.rating_count||0} /> : <span className="text-xs text-gray-400">No ratings</span>}</div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop: table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm min-w-[520px]">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="py-3 px-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest w-1/4">Feature</th>
                          <th className="py-3 px-4 text-center text-xs font-bold text-red-500 uppercase tracking-widest">This Product</th>
                          <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-widest">Compared</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-50">
                          <td className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Image</td>
                          {[{ img: src, name: title }, { img: resolveImg(compareProduct.image), name: compareProduct.title || compareProduct.product_name }].map((x, i) => (
                            <td key={i} className="py-4 px-4 text-center">
                              {x.img ? <img src={x.img} className="h-28 w-20 object-cover rounded-2xl mx-auto shadow-sm" alt="" onError={e => e.currentTarget.style.display="none"} /> : <div className="h-28 w-20 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center"><Package className="w-6 h-6 text-gray-300" /></div>}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-50"><td className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</td><td className="py-4 px-4 text-center font-semibold text-gray-800 text-sm">{title}</td><td className="py-4 px-4 text-center font-semibold text-gray-800 text-sm">{compareProduct.title || compareProduct.product_name}</td></tr>
                        <tr className="border-b border-gray-50"><td className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Brand</td><td className="py-4 px-4 text-center text-gray-700">{product.brand || product.brand_name}</td><td className="py-4 px-4 text-center text-gray-700">{compareProduct.brand || compareProduct.brand_name}</td></tr>
                        <tr className="border-b border-gray-50"><td className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</td><td className="py-4 px-4 text-center font-black text-orange-600 text-base">PKR {Number(product.price).toLocaleString()}</td><td className="py-4 px-4 text-center font-black text-orange-600 text-base">PKR {Number(compareProduct.price).toLocaleString()}</td></tr>
                        <tr className="border-b border-gray-50">
                          <td className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</td>
                          <td className="py-4 px-4"><div className="flex justify-center">{avgRating > 0 ? <StarRow rating={avgRating} count={ratingCount} /> : <span className="text-xs text-gray-400">No ratings yet</span>}</div></td>
                          <td className="py-4 px-4"><div className="flex justify-center">{(Number(compareProduct.avg_rating)||0) > 0 ? <StarRow rating={compareProduct.avg_rating} count={compareProduct.rating_count||0} /> : <span className="text-xs text-gray-400">No ratings yet</span>}</div></td>
                        </tr>
                        <tr>
                          <td className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Trending</td>
                          <td className="py-4 px-4 text-center">{isTrend ? <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /> Yes</span> : <span className="text-xs text-gray-400">—</span>}</td>
                          <td className="py-4 px-4 text-center">{Number(compareProduct.score)>15 ? <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /> Yes</span> : <span className="text-xs text-gray-400">—</span>}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Cart Toast */}
      {cartFlash && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div><p className="text-sm font-bold">Added to Cart</p><p className="text-xs text-gray-400 line-clamp-1">{title}</p></div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center mx-auto mb-5"><ShoppingCart className="w-7 h-7 text-white" /></div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-500 text-sm mb-7">Login to add items to cart or buy from brand websites.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogin(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => navigate("/auth")} className="flex-1 py-3 rounded-xl text-white text-sm font-bold shadow-lg" style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>Login Now</button>
            </div>
          </div>
        </div>
      )}

      {showRating && <RatingPopup type="product" id={product.id} name={title} onClose={() => setShowRating(false)} onSubmit={handleRatingSubmit} />}

      {/* BuyNow Modal — appears 8s after redirect */}
      {modalProduct && <BuyNowModal product={modalProduct} onClose={closeModal} onOrderSaved={(data) => console.log("Order saved:", data)} />}
    </div>
  );
}