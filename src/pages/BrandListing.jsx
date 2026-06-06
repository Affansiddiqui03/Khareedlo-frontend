// src/pages/BrandListing.jsx
// UPDATED: Removed category filters (All/Women/Men/Kids/Unisex)

import React, { useState, useEffect, useMemo } from "react";
import BrandCard from "../components/BrandCard";
import Footer from "../components/Footer";
import { Search, SlidersHorizontal } from "lucide-react";

export default function BrandListing() {
  const [brands, setBrands] = useState([]);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [city, setCity] = useState("All");

  useEffect(() => {
    fetch("https://khareedlo-backend-production.up.railway.app/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Unique cities from brands
  const cities = useMemo(() => {
    const cs = [...new Set(brands.map((b) => b.city).filter(Boolean))].sort();
    return ["All", ...cs];
  }, [brands]);

  const filtered = useMemo(() => {
    let data = [...brands];

    // Search
    if (q.trim()) {
      data = data.filter((b) =>
        (b.name || b.brand_name || "")
          .toLowerCase()
          .includes(q.toLowerCase())
      );
    }

    // City filter
    if (city !== "All") {
      data = data.filter((b) => b.city === city);
    }

    // Sorting
    if (sortBy === "name") {
      data.sort((a, b) =>
        (a.name || a.brand_name || "").localeCompare(
          b.name || b.brand_name || ""
        )
      );
    } else if (sortBy === "popular") {
      data.sort(
        (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
      );
    }

    return data;
  }, [q, sortBy, city, brands]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f]">
      {/* Header */}
      <div className="text-center py-14 px-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
          Discover Brands
        </h1>

        <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Pakistan's most trusted fashion brands — verified, premium &amp;
          authentic.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/40 bg-white/80 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-indigo-400 outline-none text-sm placeholder-gray-400"
          />
        </div>

        {/* Sort + City */}
        <div className="flex gap-3 flex-wrap">
          {/* Sort */}
          <div className="relative flex-1 min-w-[150px]">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/40 bg-white/80 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-indigo-400 text-sm cursor-pointer outline-none appearance-none"
            >
              <option value="name">Sort: A–Z</option>
              <option value="popular">Sort: Top Rated</option>
            </select>
          </div>

          {/* City */}
          {cities.length > 1 && (
            <div className="relative flex-1 min-w-[150px]">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-white/40 bg-white/80 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-indigo-400 text-sm cursor-pointer outline-none appearance-none"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="max-w-7xl mx-auto px-6 mb-4">
        <p className="text-sm text-gray-500 font-medium">
          {filtered.length} brand{filtered.length !== 1 ? "s" : ""} found
          {city !== "All" ? ` · ${city}` : ""}
        </p>
      </div>

      {/* Brand Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {brands.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/60 rounded-3xl h-64 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No brands found for "{q}"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((brand) => (
              <BrandCard
                key={brand.id || brand.brand_id}
                brand={brand}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}