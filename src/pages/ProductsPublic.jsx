import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProductsPublic() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All"); // Category filter
  const [products, setProducts] = useState([]);
  // const [brands] = useState([]); // Later you can fetch brands too

  const categories = ["All", "Men", "Women", "Kids"];

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched products:", data); // debug
        // Ensure products is always an array
        setProducts(Array.isArray(data) ? data : data.products || []);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  // Filter products based on search and category
const filtered = useMemo(() => {
  if (!Array.isArray(products)) return [];

  return products.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(q.toLowerCase());

    const matchesCategory =
      category === "All" ||
      p.category?.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });
}, [q, category, products]);


  return (
    <div className="bg-gradient-to-b from-[#f0dddd] to-[#ffb48f] min-h-screen">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

    {/* ===== Header ===== */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 text-center lg:text-left">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-black tracking-tight">
        Explore Products
      </h1>

      <div className="relative w-full sm:max-w-md mx-auto lg:mx-0">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
          🔍
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 rounded-3xl border border-gray-300 bg-white/70 backdrop-blur-sm shadow-lg
                 focus:ring-2 focus:ring-gray-700 focus:border-indigo-500 outline-none text-gray-900 placeholder-gray-400
                 transition duration-300 hover:shadow-2xl"
        />
      </div>
    </div>

    {/* ===== Category Filter Pills ===== */}
    <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold transition
            ${
              category === cat
                ? "bg-amber-400 text-white shadow-md"
                : "bg-white/80 text-gray-700 hover:bg-indigo-100"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* ===== Product Grid ===== */}
    <div className="
      grid gap-6
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      xl:grid-cols-5
    ">
      {filtered.map((p) => (
        <Link to={`/product/${p.id}`} key={p.id} className="group">

          <div className="bg-[#efeefa] rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden h-full">
            <div className="relative">
              <img
                src={p.image}
                alt={p.title}
                className="
                  w-full object-cover
                  h-40 sm:h-44 md:h-48 lg:h-52
                  transition-transform duration-300 group-hover:scale-105
                "
              />
              {p.trending && (
                <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-3 py-1 rounded-full">
                  Trending
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col gap-1">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {p.brand}
              </p>
              <p className="mt-1 font-bold text-indigo-600 text-sm sm:text-base">
                PKR {p.price}
              </p>
            </div>
          </div>

        </Link>
      ))}
    </div>

    {filtered.length === 0 && (
      <div className="text-center text-gray-500 py-20 text-lg">
        No products found
      </div>
    )}
  </div>
</div>

  );
}
