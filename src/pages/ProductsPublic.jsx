import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductsPublic() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const categories = ["All", "Men", "Women", "Kids"];

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.products || []);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  // 🔧 PRODUCT CLICK TRACKER
  const trackProductClick = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch("http://localhost:5000/api/user/track/product-click", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: product.title,
          brandName: product.brand,
        }),
      });
    } catch (err) {
      console.error("Product click tracking failed", err);
    }
  };

  // Filter products
  const filtered = useMemo(() => {
  return products
    .filter((p) => {
      const matchesSearch =
        p.title?.toLowerCase().includes(q.toLowerCase());

      const matchesCategory =
        category === "All" ||
        p.category?.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => Number(a.price) - Number(b.price)); // 🔥 LOW → HIGH
}, [q, category, products]);

  return (
    <div className="bg-gradient-to-b from-[#f0dddd] to-[#ffb48f] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <h1 className="text-4xl font-extrabold">Explore Products</h1>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="px-5 py-3 rounded-full border w-full max-w-md"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold
                ${
                  category === cat
                    ? "bg-amber-400 text-white"
                    : "bg-white text-gray-700"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={async () => {
                await trackProductClick(p); // 🔥 CLICK TRACK
                navigate(`/product/${p.id}`); // ➜ NAVIGATE
              }}
              className="group cursor-pointer"
            >
              <div className="bg-[#efeefa] rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden h-full">
                <img
                  src={`http://localhost:5000/${p.image}`}
                  alt={p.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500">{p.brand}</p>
                  <p className="mt-1 font-bold text-indigo-600">
                    PKR {p.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
