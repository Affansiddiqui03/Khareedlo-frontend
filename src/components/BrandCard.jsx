import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

// 🔹 Brand logos (HAR BRAND KA ALAG)
import zellburyLogo from "../assets/brand4.jpeg";
import jLogo from "../assets/brand2.png";
import alkaramLogo from "../assets/brand3.png";
import limelightLogo from "../assets/brand1.jpg";

const brandLogos = {
  "J. By Junaid Jamshed": jLogo,
  "Alkaram": alkaramLogo,
  "Zellbury": zellburyLogo,
  "Limelight": limelightLogo,
};
// const popularBrands = [
//   "J. By Junaid Jamshed",
//   "Alkaram"
// ];



export default function BrandCard({ brand }) {
  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition overflow-hidden relative">

      {/* Banner fake gradient */ }
      <div className="h-32 bg-gradient-to-br from-red-300 to-amber-200" />

      {/* Content */ }
      <div className="relative px-5 pb-6">

        {/* ✅ Popular Badge */ }

        {/* { popularBrands.includes(brand.name) && (
          <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Popular
          </span>
        ) } */}

        {/* Logo */ }
        <div className="-mt-10 bg-white w-20 h-20 rounded-2xl shadow flex items-center justify-center overflow-hidden">
          <img
            src={ brandLogos[brand.name] || "/fallback-logo.png" }
            alt={ brand.name }
            className="w-14 h-14 object-contain"
          />
        </div>

        {/* Brand Name & City */ }
        <h3 className="mt-4 text-lg font-bold">{ brand.name }</h3>
        <p className="text-sm text-gray-500">{ brand.city }</p>

        {/* Rating */ }
        <div className="flex items-center gap-1 mt-2 text-sm text-yellow-500">
          <Star className="w-4 h-4 fill-yellow-400" />
          { brand.rating } <span className="text-gray-400">(Verified)</span>
        </div>

        {/* View Brand Button */ }
        <Link
          to={ `/brands/${brand.id}` }
          className="block mt-5 text-center bg-gradient-to-r from-red-600 to-[#f2976a] hover:from-red-700 hover:to-[#f2a77a] transition-colors text-white py-2.5 rounded-xl font-semibold"
        >
          View Brand
        </Link>
      </div>
    </div>
  );
}
