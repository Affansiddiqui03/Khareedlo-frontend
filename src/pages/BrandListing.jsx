// src/pages/BrandListing.jsx
// FIXED: "Popular" sort now sorts by rating DESC (was hardcoded to 2 brand names)

import React, { useState, useEffect, useMemo } from "react";
import BrandCard from "../components/BrandCard";
import Footer from "../components/Footer";

export default function BrandListing() {
  const [brands, setBrands] = useState([]);
  const [q,      setQ]      = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetch("https://khareedlo-backend-production.up.railway.app/api/brands")
      .then(res => res.json())
      .then(data => setBrands(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let data = [...brands];

    // Search by name
    if (q.trim()) {
      data = data.filter(b =>
        (b.name || b.brand_name || "").toLowerCase().includes(q.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "name") {
      data.sort((a, b) =>
        (a.name || a.brand_name || "").localeCompare(b.name || b.brand_name || "")
      );
    } else if (sortBy === "popular") {
      // Sort by rating DESC — highest rated brands first
      data.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }

    return data;
  }, [q, sortBy, brands]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f]">

      {/* Header */}
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Discover Brands
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Pakistan's most trusted fashion brands — verified, premium & authentic.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="px-4 sm:px-6 my-4 max-w-lg mx-auto w-full">
        {/* Search input */}
        <div className="relative mb-2">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z" />
          </svg>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/40 bg-white/80 backdrop-blur-sm
                       shadow-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                       outline-none text-sm placeholder-gray-400"
          />
        </div>
        {/* Sort filter */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M10 17h4" />
          </svg>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-white/40 bg-white/80 backdrop-blur-sm
                       shadow-md focus:ring-2 focus:ring-indigo-400 text-sm cursor-pointer
                       outline-none appearance-none"
          >
            <option value="name">Sort: A–Z</option>
            <option value="popular">Sort: Popular (Top Rated)</option>
          </select>
        </div>
      </div>

      {/* Brand Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {brands.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/60 rounded-3xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {filtered.map(brand => (
              <BrandCard key={brand.id || brand.brand_id} brand={brand} />
            ))}
          </div>
        )}

        {filtered.length === 0 && brands.length > 0 && (
          <div className="text-center text-gray-500 py-20">
            No brands found for "<strong>{q}</strong>"
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}