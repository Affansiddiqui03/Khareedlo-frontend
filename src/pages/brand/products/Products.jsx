// src/pages/Products.jsx
import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { products, brands } from "../data/demoData";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [params] = useSearchParams();
  const brandId = params.get("brand");

  const [page, setPage] = useState(1);
  const perPage = 8;

  // 🔹 Filter products (brand ho ya na ho)
  const filteredProducts = useMemo(() => {
    if (!brandId) return products;
    return products.filter((p) => p.brand === brandId);
  }, [brandId]);

  const total = filteredProducts.length;
  const start = (page - 1) * perPage;
  const paginatedProducts = filteredProducts.slice(start, start + perPage);

  const brandName =
    brands.find((b) => b._id === brandId)?.name || "All Products";

  if (!filteredProducts.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No products found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">{brandName}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {paginatedProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {/* Pagination */}
      {total > perPage && (
        <div className="flex justify-center gap-3 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page * perPage >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
