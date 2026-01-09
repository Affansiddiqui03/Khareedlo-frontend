import React, { useState, useMemo } from "react";
import BrandCard from "../components/BrandCard";
import { brands } from "../data/demoData";

export default function BrandListing() {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filtered = useMemo(() => {
    let data = [...brands];

    if (q.trim()) {
      data = data.filter((b) =>
        b.name.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (sortBy === "name") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [q, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f]">

      {/* ===== HEADER ===== */ }
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Discover Brands
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Pakistan’s most trusted fashion brands — verified, premium & authentic.
        </p>
      </div>

      {/* ===== FILTER BAR ===== */ }
      <div className="flex justify-center mt-1 my-12 px-6">
        <div className="flex items-center w-full max-w-lg bg-gradient-to-r from-white/90 to-white/70 
                  backdrop-blur-xl border border-white/30 rounded-full shadow-lg p-2 gap-2 transition 
                  hover:shadow-2xl">

          {/* SEARCH */ }
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
              />
            </svg>
            <input
              value={ q }
              onChange={ (e) => setQ(e.target.value) }
              placeholder="Search brands..."
              className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-200
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   outline-none text-sm transition duration-300
                   bg-white/70 backdrop-blur-sm placeholder-gray-400
                   hover:bg-white"
            />
          </div>

          {/* SORT */ }
          <select
            value={ sortBy }
            onChange={ (e) => setSortBy(e.target.value) }
            className="px-4 py-2 rounded-full border border-gray-200 bg-white/80
                 text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500
                 focus:border-indigo-500 transition duration-300
                 hover:bg-white"
          >
            <option value="name">Name</option>
            <option value="latest">Newest</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>


      {/* ===== BRAND GRID ===== */ }
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          { filtered.map((brand) => (
            <BrandCard key={ brand._id } brand={ brand } />
          )) }
        </div>

        { filtered.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            No brands found.
          </div>
        ) }
      </div>
    </div>
  );
}
