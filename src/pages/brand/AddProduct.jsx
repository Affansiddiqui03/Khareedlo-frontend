// src/pages/brand/AddProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  // ✅ Form state
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  // ✅ Image preview state
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ Handle image upload
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
  };

  // ✅ Save New Product
  const handleSubmit = (e) => {
    e.preventDefault();

    const product = {
      id: Date.now(),
      name: form.name,
      price: form.price,
      stock: form.stock,
      category: form.category,
      description: form.description,
      image: imagePreview,
    };

    const stored = JSON.parse(localStorage.getItem("brandProducts")) || [];
    stored.push(product);

    localStorage.setItem("brandProducts", JSON.stringify(stored));

    alert("✅ Product added!");

    navigate("/brand/products"); // ✅ Proper redirect
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Product Name */}
        <input
          required
          placeholder="Product Name"
          className="p-3 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Price */}
        <input
          required
          type="number"
          placeholder="Price"
          className="p-3 border rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        {/* Category */}
        <input
          placeholder="Category"
          className="p-3 border rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        {/* Stock */}
        <input
          type="number"
          placeholder="Stock Quantity"
          className="p-3 border rounded"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        {/* Description */}
        <textarea
          placeholder="Product Description"
          rows={3}
          className="p-3 border rounded md:col-span-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* ✅ Image Upload */}
        <div className="md:col-span-2">
          <label className="font-semibold">Product Image</label>
          <input
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={handleImage}
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="mt-4 h-40 rounded-lg object-cover"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/brand/products")}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
