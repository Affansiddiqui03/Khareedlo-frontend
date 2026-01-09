import React, { useState } from "react";

const mockBrands = [
  {
    id: 1,
    name: "Khaadi",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b8/Khaadi_Logo.png",
    rating: 4.8,
    priceRange: "PKR 3000 - 10000",
    avgPrice: 7000,
    comfort: 9.5,
    scalability: 8.7,
    reliability: 9.2,
  },
  {
    id: 2,
    name: "Gul Ahmed",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/d1/Gul_Ahmed_Logo.png",
    rating: 4.5,
    priceRange: "PKR 2500 - 9000",
    avgPrice: 6000,
    comfort: 8.8,
    scalability: 9.1,
    reliability: 8.9,
  },
  {
    id: 3,
    name: "Alkaram Studio",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/f9/Alkaram_Studio_Logo.png",
    rating: 4.3,
    priceRange: "PKR 3500 - 12000",
    avgPrice: 8500,
    comfort: 8.9,
    scalability: 8.5,
    reliability: 8.7,
  },
  {
    id: 4,
    name: "Sana Safinaz",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b2/Sana_Safinaz_Logo.png",
    rating: 4.9,
    priceRange: "PKR 4000 - 15000",
    avgPrice: 9500,
    comfort: 9.7,
    scalability: 9.3,
    reliability: 9.5,
  },
];

export default function BrandPage() {
  const [sortBy, setSortBy] = useState("rating");

  const sortedBrands = [...mockBrands].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price") return a.avgPrice - b.avgPrice;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fdb3] to-[#ffff] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          Explore Top Pakistani Brands 👕
        </h1>

        {/* Sorting Options */}
        <div className="flex justify-center mb-10">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="rating">Sort by Rating (High → Low)</option>
            <option value="price">Sort by Price (Low → High)</option>
          </select>
        </div>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sortedBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition hover:scale-105 border border-gray-100"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-24 w-auto mx-auto mb-4 object-contain"
              />
              <h2 className="text-2xl font-semibold text-indigo-700 text-center">
                {brand.name}
              </h2>
              <p className="text-gray-600 text-center mt-2">
                {brand.priceRange}
              </p>
              <div className="flex justify-center mt-3 space-x-3 text-sm text-gray-600">
                <span>⭐ {brand.rating}</span>
                <span>🧵 Comfort: {brand.comfort}</span>
              </div>
              <div className="flex justify-center space-x-3 text-sm text-gray-600">
                <span>⚙️ Scalability: {brand.scalability}</span>
                <span>✅ Reliability: {brand.reliability}</span>
              </div>

              <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                View Brand
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
