import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

import { CartContext } from "../contexts/CartContext";
// import { searchOutlets } from "../services/outletService";

import { brands} from "../data/demoData";
import BrandCard from "../components/BrandCard";
import ProductCard from "../components/ProductCard";

import banner1 from "../assets/banner1.webp";
import banner2 from "../assets/banner2.webp";
import banner3 from "../assets/banner3.jpg";
import banner4 from "../assets/banner4.png";
import outletImg from "../assets/outlet.png";

export default function Home() {
  const { addToCart } = useContext(CartContext);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  // const [outlets, setOutlets] = useState([]);

  // const trending = products.filter((p) => p.trending);
const [trending, setTrending] = useState([]);

const handleOutletSearch = () => {
  if (!query.trim()) return;

  navigate(`/explore?brand=${encodeURIComponent(query)}`);
};
useEffect(() => {
  async function loadTrending() {
    try {
      const res = await fetch("http://localhost:5000/api/trending");
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      setTrending(data);
    } catch (err) {
      console.error("Trending fetch failed:", err);
      setTrending([]); // safe fallback
    }
  }
  loadTrending();
}, []);
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b to-[#fff4d9]">

      {/* ================= HERO ================= */}
      <section className="relative w-full overflow-hidden">
        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
          {[banner1, banner2, banner3, banner4].map((img, i) => (
            <div
              key={i}
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[80vh]"
            >
              <img
                src={img}
                alt="KHAREEDLO Banner"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center px-4">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                    Discover Premium <br className="hidden sm:block" />
                    Fashion Brands
                  </h1>
                  <p className="mt-4 text-white/80 max-w-xl mx-auto">
                    Discover Pakistan’s top brands, trending products & nearby outlets.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                      to="/products"
                      className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-[#f2976a] text-white font-semibold"
                    >
                      Shop Now
                    </Link>
                    <Link
                      to="/brands"
                      className="px-8 py-3 rounded-full bg-white text-black font-semibold"
                    >
                      Explore Brands
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* ================= POPULAR BRANDS ================= */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-5xl font-extrabold text-center mb-10">
          Popular Brands
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <BrandCard key={brand._id} brand={brand} />
          ))}
        </div>
      </section>

      {/* ================= TRENDING PRODUCTS ================= */}
      <section className="bg-gradient-to-b from-red-100 to-[#fff4d9] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold">Trending Products</h2>
            <Link to="/products" className="font-semibold hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trending.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUTLET DISCOVERY ================= */}
<section className="py-20 bg-gradient-to-r from-indigo-100 to-purple-100">
  <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
    {/* Left Side - Text & Search */}
    <div>
      <h2 className="text-5xl font-extrabold">Explore Outlets</h2>
      <p className="mt-4 text-xl text-gray-600">
        Find brand outlets and boutiques near you.
      </p>

      {/* Search Form */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city or brand"
          className="w-full sm:flex-1 px-5 py-3 rounded-full outline-none border border-gray  focus:ring-2 focus:ring-red-400 transition"
        />
        <button
          onClick={handleOutletSearch}
          disabled={!query.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-[#f2976a] text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition"
        >
          Search
        </button>
      </div>
    </div>

    {/* Right Side - Image */}
    <div className="hidden md:flex justify-center">
      <img
        src={outletImg}
        alt="Outlet"
        className="max-w-md w-full object-contain"
      />
    </div>
  </div>
</section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gradient-to-b from-red-100 to-[#fcbf7e] text-black pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-2xl font-extrabold">KHAREEDLO</h3>
            <p className="mt-3 text-sm">
              Discover trends. Shop smart. Stay stylish.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/brands">Brands</Link></li>
              <li><Link to="/products">Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li
                className="cursor-pointer"
                onClick={() => setShowAboutModal(true)}
              >
                About
              </li>
              <li
                className="cursor-pointer"
                onClick={() => navigate("/contact-us")}
              >
                Contact
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <FaInstagram />
              <FaFacebookF />
              <FaTwitter />
            </div>
          </div>
        </div>

        <div className="text-center text-sm mt-10">
          © {new Date().getFullYear()} KHAREEDLO. All rights reserved.
        </div>
      </footer>

      {/* ================= ABOUT MODAL ================= */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-red-600 to-[#f2976a] text-white p-8 rounded-2xl max-w-md text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              About KHAREEDLO
            </h2>
            <p className="text-sm mb-6">
              KHAREEDLO is Pakistan’s fashion discovery platform helping you
              explore top brands and trending products.
            </p>
            <button
              onClick={() => setShowAboutModal(false)}
              className="bg-white text-black px-6 py-2 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
