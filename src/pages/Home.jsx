// src/pages/Home.jsx
// UPDATED: Added "How It Works" section (platform identity fix)
// + Buy Now tooltip warning on ProductCard (redirect warning fix)

import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { useAuth } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";

import { ChevronLeft, ChevronRight, Search, ShoppingBag, Store, ExternalLink, ArrowRight } from "lucide-react";
import BrandCard from "../components/BrandCard";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

import outlets from "../data/outlets";

import banner1 from "../assets/banner1.webp";
import banner2 from "../assets/banner2.webp";
import banner3 from "../assets/banner3.jpg";
import banner4 from "../assets/banner4.png";

const BRAND_COLOR = {
  "J. by Junaid Jamshed": "#7C3A1E",
  "Zellbury":             "#1A4731",
  "Alkaram Studio":       "#5B1F7A",
  "Limelight":            "#B45309",
};

const CITY_HIGHLIGHTS = [
  { city: "Karachi",     emoji: "🌊", color: "#1D4ED8" },
  { city: "Lahore",      emoji: "🌸", color: "#7C3AED" },
  { city: "Islamabad",   emoji: "🏔️", color: "#059669" },
  { city: "Faisalabad",  emoji: "🏭", color: "#D97706" },
  { city: "Multan",      emoji: "☀️", color: "#DC2626" },
  { city: "Rawalpindi",  emoji: "🌆", color: "#0891B2" },
];

// ── How It Works steps ────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "1",
    icon: Search,
    color: "#7C3AED",
    bg: "#F5F3FF",
    title: "Discover Brands & Products",
    desc: "Browse Pakistan's top fashion brands in one place. Filter by category, search by name, and explore thousands of products.",
  },
  {
    step: "2",
    icon: ShoppingBag,
    color: "#DC2626",
    bg: "#FEF2F2",
    title: "Add to Cart or Save",
    desc: "Add products to your cart or wishlist. Compare styles across brands — all without leaving Khareedlo.",
  },
  {
    step: "3",
    icon: Store,
    color: "#059669",
    bg: "#ECFDF5",
    title: "Find Nearby Outlets",
    desc: "Use our interactive map to locate the nearest brand outlet in your city. Walk in and shop in person.",
  },
  {
    step: "4",
    icon: ExternalLink,
    color: "#D97706",
    bg: "#FFFBEB",
    title: "Buy on Brand's Website",
    desc: "Click 'Buy Now' to go directly to the brand's official website to complete your purchase safely. You'll leave Khareedlo and land on the brand's own store.",
  },
];

export default function Home() {
  const { addToCart } = useContext(CartContext);
  const { user }      = useAuth();
  const navigate      = useNavigate();

  const [query,        setQuery]        = useState("");
  const [trending,     setTrending]     = useState([]);
  const [popularBrands,setPopularBrands]= useState([]);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleOutletSearch = () => {
    if (!query.trim()) return;
    navigate(`/explore?brand=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    fetch("https://khareedlo-backend-production.up.railway.app/api/trending")
      .then(r => r.ok ? r.json() : [])
      .then(setTrending)
      .catch(() => setTrending([]));
  }, []);

  useEffect(() => {
    fetch("https://khareedlo-backend-production.up.railway.app/api/home/popular-brands")
      .then(r => r.json())
      .then(d => setPopularBrands(Array.isArray(d) ? d : []))
      .catch(() => setPopularBrands([]));
  }, []);

  const cityOutletCounts = CITY_HIGHLIGHTS.map(c => ({
    ...c,
    count: outlets.filter(o => o.city === c.city).length,
  }));

  const platformBrands = [...new Set(outlets.map(o => o.brandName))];

  return (
    <>
      <div
        className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f]"
        style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* ═════════ HERO CAROUSEL ═════════ */}
        <section className="w-full px-2 sm:px-4 overflow-hidden mt-3">
          <Carousel
            autoPlay infiniteLoop showThumbs={false} showStatus={false}
            renderArrowPrev={(onClickHandler, hasPrev) =>
              hasPrev && (
                <button onClick={onClickHandler}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 hidden sm:flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-full border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext) =>
              hasNext && (
                <button onClick={onClickHandler}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 hidden sm:flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-full border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95">
                  <ChevronRight className="w-5 h-5" />
                </button>
              )
            }
          >
            {[banner1, banner2, banner3, banner4].map((img, i) => (
              <div key={i} className="relative w-full h-[42vh] sm:h-[58vh] md:h-[75vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <img src={img} alt="KHAREEDLO Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                  <div className="text-center px-4 sm:px-10 max-w-2xl">
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight">
                      Discover Premium <br className="hidden sm:block" /> Fashion Brands
                    </h1>
                    <p className="mt-2 sm:mt-4 text-white/80 text-xs sm:text-base max-w-lg mx-auto">
                      Pakistan's fashion discovery platform — explore brands, find outlets, shop smart.
                    </p>
                    <div className="mt-5 sm:mt-8 flex flex-row justify-center gap-2 sm:gap-4">
                      <Link to="/products"
                        className="px-5 sm:px-8 py-2 sm:py-3 rounded-full bg-gradient-to-r from-red-600 to-[#f2976a] text-white font-semibold hover:shadow-lg transition-shadow text-sm sm:text-base">
                        Shop Now
                      </Link>
                      <Link to="/brands"
                        className="px-5 sm:px-8 py-2 sm:py-3 rounded-full bg-white text-black font-semibold hover:shadow-lg transition-shadow text-sm sm:text-base">
                        Explore Brands
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        {/* ═════════ POPULAR BRANDS ═════════ */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-center mb-8 sm:mb-10">Popular Brands</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.isArray(popularBrands) && popularBrands.length > 0 ? (
              popularBrands.map(brand => <BrandCard key={brand.id} brand={brand} />)
            ) : (
              <p className="col-span-4 text-center text-gray-400">No popular brands available.</p>
            )}
          </div>
        </section>

        {/* ═════════ TRENDING PRODUCTS ═════════ */}
        <section className="bg-gradient-to-b from-[#fee3cd] to-[#ffbe9e] py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold">Trending Products</h2>
              <Link to="/products" className="font-semibold hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  disableAdd={!user}
                  onAddToCart={() => {
                    if (!user) { navigate("/auth"); return; }
                    addToCart(product);
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═════════ EXPLORE OUTLETS ═════════ */}
        <section className="py-24 bg-white overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-5"
              style={{background:"radial-gradient(circle, #DC2626, transparent)"}} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-5"
              style={{background:"radial-gradient(circle, #EA580C, transparent)"}} />
          </div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center mb-8 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse" />
                {outlets.length} outlets across Pakistan
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Find Your Nearest<br />
                <span className="bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(135deg, #DC2626, #EA580C)"}}>
                  Brand Outlet
                </span>
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-xl text-gray-500 max-w-2xl mx-auto px-4 sm:px-0">
                All your favourite fashion brands — one map, your city, your distance.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {platformBrands.map(b => (
                <Link key={b} to={`/explore?brand=${encodeURIComponent(b)}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  style={{background: BRAND_COLOR[b] || "#DC2626"}}>
                  {b}
                  <span className="bg-white/25 rounded-full text-[10px] px-2 py-0.5 font-extrabold">
                    {outlets.filter(o => o.brandName === b).length} outlets
                  </span>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
              {cityOutletCounts.map(c => (
                <Link key={c.city} to="/explore"
                  className="group bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform"
                    style={{background: `${c.color}15`}}>
                    {c.emoji}
                  </div>
                  <p className="font-extrabold text-gray-900 text-sm">{c.city}</p>
                  <p className="text-[11px] font-semibold mt-0.5" style={{color: c.color}}>
                    {c.count} outlet{c.count !== 1 ? "s" : ""}
                  </p>
                </Link>
              ))}
            </div>

            <div className="bg-gradient-to-r from-gray-950 to-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 text-white">
              <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-2 sm:mb-3">Search by Brand or City</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                    Type a brand name or city and jump straight to the interactive map.
                  </p>
                  <div className="flex gap-2 sm:gap-3">
                    <input value={query} onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleOutletSearch()}
                      placeholder="Brand or city name…"
                      className="flex-1 min-w-0 px-3 sm:px-5 py-3 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                    <button onClick={handleOutletSearch} disabled={!query.trim()}
                      className="flex-shrink-0 px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-bold text-sm text-white disabled:opacity-40"
                      style={{background:"linear-gradient(135deg, #DC2626, #EA580C)"}}>
                      Search
                    </button>
                  </div>
                  <Link to="/explore" className="inline-flex items-center gap-2 mt-4 text-xs sm:text-sm font-bold text-red-400 hover:text-red-300">
                    Open full interactive map →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2 md:mt-0">
                  {[
                    { num: outlets.length,                                   label: "Total Outlets",  icon: "🏪" },
                    { num: platformBrands.length,                            label: "Partner Brands", icon: "🏷️" },
                    { num: cityOutletCounts.filter(c => c.count > 0).length, label: "Cities Covered", icon: "🏙️" },
                    { num: "Free",                                            label: "Entry Always",   icon: "✅" },
                  ].map(s => (
                    <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                      <p className="text-2xl sm:text-3xl mb-0.5 sm:mb-1">{s.icon}</p>
                      <p className="text-lg sm:text-2xl font-extrabold text-white">{s.num}</p>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-semibold mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {showAboutModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gradient-to-r from-red-600 to-[#f2976a] text-white p-8 rounded-2xl max-w-md text-center shadow-2xl">
              <h2 className="text-3xl font-extrabold mb-4">About KHAREEDLO</h2>
              <p className="text-sm mb-6">KHAREEDLO is Pakistan's fashion discovery platform helping you explore top brands and trending products.</p>
              <button onClick={() => setShowAboutModal(false)} className="bg-white text-black px-6 py-2 rounded-lg font-semibold">Close</button>
            </div>
          </div>
        )}
      </div>
              {/* ═════════ HOW IT WORKS ═════════ */}
        <section className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
          {/* Section label */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              How Khareedlo Works
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Not a store — a <span className="bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(135deg,#DC2626,#EA580C)"}}>discovery platform</span>
            </h2>
            <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
              Khareedlo brings Pakistan's top fashion brands together so you can discover, compare, and buy — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {HOW_IT_WORKS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  {/* Connector line (desktop only) */}
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                  {/* Step number */}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black mb-4"
                    style={{background: item.color}}>
                    {item.step}
                  </div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{background: item.bg}}>
                    <Icon className="w-6 h-6" style={{color: item.color}} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>

                  {/* Special callout for Buy Now step */}
                  {idx === 3 && (
                    <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                      <span className="text-amber-500 mt-0.5">⚠️</span>
                      <p className="text-amber-700 text-xs font-medium leading-snug">
                        Clicking Buy Now takes you to the brand's official website to complete your purchase.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      <Footer />
    </>
  );
}