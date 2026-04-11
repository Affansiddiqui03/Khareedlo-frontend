import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { brandAssets } from "../data/brandAssets";

import ProductCard from "../components/ProductCard";

export default function BrandDetails() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  const [loading, setLoading] = useState(true);

const normalizedProducts = Array.isArray(products)
  ? products.map(p => ({
      id: p.id,
      title: p.name || p.title,
      price: p.price,
      image: p.image && p.image !== "photos/"
        ? p.image
        : "photos/placeholder.png",
      category_id: p.category_id,
      sub_category_id: p.sub_category_id
    }))
  : [];

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("http://localhost:5000/api/user/track/brand", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}, []);


const filteredProducts = normalizedProducts.filter(p => {
  if (activeCategory && p.category_id !== activeCategory) return false;
  if (activeSubCategory && p.sub_category_id !== activeSubCategory) return false;
  return true;
});




  const assets = useMemo(() => {
    if (!brand) return {};
    return brandAssets[brand.name];
  }, [brand]);

  
  /* ======================
     FETCH REAL DATA
  ====================== */
  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`http://localhost:5000/api/brands/${id}`).then(res => res.json()),
      fetch(`http://localhost:5000/api/products/brand/${id}/seo`).then(res => res.json())
    ])
      .then(([brandData, productData]) => {
        setBrand(brandData);
        setProducts(productData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);
useEffect(() => {
  console.log("Products:", products);
}, [products]);
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/brand/${id}/categories`)
      .then(res => res.json())
      .then(setCategories);
  }, [id]);

  useEffect(() => {
    if (!activeCategory) return;

    fetch(
      `http://localhost:5000/api/products/brand/${id}/subcategories/${activeCategory}`
    )
      .then(res => res.json())
      .then(setSubCategories);
  }, [activeCategory, id]);

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (!brand) {
    return <div className="py-20 text-center">Brand not found</div>;
  }

  return (
    <div className="bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f] min-h-screen pb-20">

      {/* ===== HERO / CLEAN PROFESSIONAL UI ===== */ }
      <div className="relative h-[420px]">
        <img
          src={ assets?.banner }
          alt={ brand.name }
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 text-white">
            <img
              src={ assets?.logo }
              alt={ brand.name }
              className="w-24 h-24 bg-slate-200 rounded-2xl p-2 shadow-xl"
            />

            <div>
              <h1 className="text-5xl font-extrabold">{ brand.name }</h1>
              <p className="text-white/80 max-w-xl mt-2">
                { brand.description || "" }
              </p>

              {/* CONTACTS */ }
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                { assets?.phone && <span>📞 { assets.phone }</span> }
                { brand.website && (
                  <a
                    href={ brand.website }
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Website
                  </a>
                ) }
                { brand.instagram && (
                  <a
                    href={ brand.instagram }
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Instagram
                  </a>
                ) }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */ }
      <div className="max-w-7xl mx-auto px-6 mt-20 grid lg:grid-cols-4 gap-12">

        {/* ===== CATEGORIES ===== */ }
        <aside className="bg-white/100 backdrop-blur-xl rounded-3xl shadow-xl p-6 h-fit top-28">
          <h3 className="font-bold mb-4">Categories</h3>

          { categories.length === 0 && (
            <p className="text-sm text-gray-500">No categories found</p>
          ) }

          {categories.map(cat => (
  <div key={cat.category_id}>
    <button
      onClick={() => {
        setActiveCategory(cat.category_id);
        setActiveSubCategory(null);
      }}
      className={`block w-full text-left py-2 px-3 rounded-lg text-sm mb-1
        ${activeCategory === cat.category_id
          ? "bg-red-600 text-white"
          : "hover:bg-gray-100"}`}
    >
      {cat.category_name}
    </button>

    {/* SUB CATEGORIES */}
    {activeCategory === cat.category_id && (
      <div className="ml-4 mt-1">
        {subCategories.map(sub => (
          <button
            key={sub.sub_category_id}
            onClick={() => setActiveSubCategory(sub.sub_category_id)}
            className={`block text-left text-sm py-1 px-2 rounded
              ${activeSubCategory === sub.sub_category_id
                ? "text-red-600 font-semibold"
                : "text-gray-600 hover:text-black"}`}
          >
            {sub.sub_category_name}
          </button>
        ))}
      </div>
    )}
  </div>
))}


          { activeCategory && (
            <button
              onClick={ () => setActiveCategory(null) }
              className="mt-3 text-xs text-gray-500 underline"
            >
              Clear filter
            </button>
          ) }
        </aside>

        {/* ===== PRODUCTS ===== */ }
        <main className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6">
            Products{ " " }
            <span className="text-gray-400 text-sm">
              ({ filteredProducts.length } items)
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            { filteredProducts.map((p) => (
              <ProductCard
                key={ p.id }
                product={ p }
                buyNowLink={ brand.website }
              />
            )) }
          </div>
        </main>
      </div>
    </div>
  );
}
