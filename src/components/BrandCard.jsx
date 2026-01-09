import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

// 🔹 Brand logos (HAR BRAND KA ALAG)
import khaadiLogo from "../assets/brand4.png";
import jLogo from "../assets/brand2.png";

const brandLogos = {
  b1: khaadiLogo,
  b2: jLogo,
};

export default function BrandCard({ brand }) {
  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition overflow-hidden">
      
      {/* Banner fake gradient */}
      <div className="h-32 bg-gradient-to-br from-red-300 to-amber-200" />

      {/* Content */}
      <div className="relative px-5 pb-6">
        
        {/* Logo */}
        <div className="-mt-10 bg-white w-20 h-20 rounded-2xl shadow flex items-center justify-center overflow-hidden">
          <img
            src={brandLogos[brand._id]}
            alt={brand.name}
            className="w-14 h-14 object-contain"
          />
        </div>

        <h3 className="mt-4 text-lg font-bold">{brand.name}</h3>
        <p className="text-sm text-gray-500">{brand.city}</p>

        <div className="flex items-center gap-1 mt-2 text-sm text-yellow-500">
          <Star className="w-4 h-4 fill-yellow-400" />
          4.5 <span className="text-gray-400">(Verified)</span>
        </div>

        <Link
          to={`/brands/${brand._id}`}
          className="block mt-5 text-center bg-gradient-to-r from-red-600 to-[#f2976a] hover:from-red-700 hover:to-[#f2a77a] transition-colors text-white py-2.5 rounded-xl font-semibold transition"
        >
          View Brand
        </Link>
      </div>
    </div>
  );
}
