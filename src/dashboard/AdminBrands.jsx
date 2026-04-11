import React, { useEffect, useState } from "react";

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then(res => res.json())
      .then(setBrands);
  }, []);

  const deleteBrand = async (id) => {
    await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
    setBrands(prev => prev.filter(b => b.brand_id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Approved Brands</h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {brands.map(b => (
            <tr key={b.brand_id} className="border-b">
              <td>{b.brand_name}</td>
              <td>{b.email}</td>
              <td>{b.city}</td>
              <td>
                <button
                  onClick={() => deleteBrand(b.brand_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}