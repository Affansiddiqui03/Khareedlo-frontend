import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    // TODO: fetch product by ID from backend
    setForm({
      name: "Sample Product",
      price: "1200",
      category: "mens",
      stock: "10",
      description: "Sample description",
    });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("Product Updated (API pending)");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-3 border rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="p-3 border rounded"
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="p-3 border rounded"
        >
          <option value="">Select Category</option>
          <option value="mens">Men's Wear</option>
          <option value="womens">Women's Wear</option>
          <option value="kids">Kids</option>
          <option value="unstitched">Unstitched</option>
        </select>

        <input
          type="number"
          placeholder="Stock Quantity"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="p-3 border rounded"
        />

        <textarea
          rows={3}
          placeholder="Product Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="p-3 border rounded md:col-span-2"
        />

        <button
          type="submit"
          className="mt-3 md:col-span-2 bg-indigo-600 text-white p-3 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
