import React, { useMemo, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Store } from "lucide-react";
import { CartContext } from "../contexts/CartContext";

import { brands, products } from "../data/demoData";
import outletsData from "../data/outlets";
import ProductCard from "../components/ProductCard";

// 🔹 Brand banners & logos
import khaadiBanner from "../assets/banner1.webp";
import jBanner from "../assets/banner2.webp";
import khaadiLogo from "../assets/brand4.png";
import jLogo from "../assets/brand2.png";

const brandAssets = {
  b1: { banner: khaadiBanner, logo: khaadiLogo },
  b2: { banner: jBanner, logo: jLogo },
};

export default function BrandDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const brand = brands.find((b) => b._id === id);
  const brandProducts = products.filter((p) => p.brand === id);

  const brandOutlets = useMemo(() => {
    if (!brand) return [];
    return outletsData.filter((o) => o.brandId === brand._id);
  }, [brand]);

  if (!brand) {
    return <div className="py-20 text-center">Brand not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">

      {/* ===== BANNER ===== */}
      <div className="relative h-[420px]">
        <img
          src={brandAssets[id].banner}
          alt={brand.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 text-white">
            <img
              src={brandAssets[id].logo}
              alt=""
              className="w-20 h-20 bg-white rounded-2xl p-2"
            />
            <div>
              <h1 className="text-4xl font-extrabold">{brand.name}</h1>
              <p className="text-white/80 mt-1">{brand.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-6 mt-14 grid lg:grid-cols-4 gap-10">

        {/* OUTLETS */}
        <aside className="bg-white rounded-2xl shadow p-5 h-fit">
          <h3 className="font-bold mb-4">Available Outlets</h3>

          {brandOutlets.length === 0 ? (
            <p className="text-sm text-gray-500">No outlets listed.</p>
          ) : (
            brandOutlets.map((o) => (
              <Link
                key={o.id}
                to={`/products?brand=${id}&outlet=${o.id}`}
                className="flex items-center gap-2 py-2 text-sm hover:text-indigo-600"
              >
                <Store className="w-4 h-4" />
                {o.outletName}
              </Link>
            ))
          )}
        </aside>

        {/* PRODUCTS */}
        <main className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6">
            Products <span className="text-gray-400 text-sm">({brandProducts.length} items)</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={() => addToCart(p)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
