import React, { useEffect, useState } from "react";

export default function PendingProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/admin/products/pending")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const approve = (id) => {
    fetch(`/api/admin/products/${id}`, { method: "PUT" })
      .then(() =>
        setProducts(prev => prev.filter(p => p.product_id !== id))
      );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Pending Products</h2>

      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            <th>Product</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p.product_id} className="border-b">
              <td>{p.name}</td>
              <td>{p.brand_name}</td>
              <td>PKR {p.price}</td>
              <td>
                <button
                  onClick={() => approve(p.product_id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}