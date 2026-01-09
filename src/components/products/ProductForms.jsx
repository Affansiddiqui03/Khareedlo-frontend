// src/components/products/ProductForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { CATEGORY_OPTIONS } from "../../services/productService";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_OPTIONS = ["Black", "White", "Blue", "Red", "Green", "Brown", "Beige"];

export default function ProductForm({ initial, onSubmit, submitLabel = "Save Product", busy = false }) {
  const [form, setForm] = useState(
    initial || {
      title: "",
      sku: "",
      slug: "",
      category: "",
      price: "",
      compareAtPrice: "",
      discountPct: "",
      stock: "",
      sizes: [],
      colors: [],
      images: [], // [{src,name}]
      description: "",
      status: "draft",
    }
  );

  const fileRef = useRef();

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const pickImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const readers = files.map(
      (f) =>
        new Promise((res) => {
          const r = new FileReader();
          r.onload = () => res({ src: r.result, name: f.name });
          r.readAsDataURL(f);
        })
    );

    Promise.all(readers).then((arr) => {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...arr] }));
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  const removeImage = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const toggleChoice = (key, value) => {
    setForm((prev) => {
      const set = new Set(prev[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [key]: Array.from(set) };
    });
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.category) return "Select a category.";
    if (!form.price || Number(form.price) <= 0) return "Enter a valid price.";
    if (form.stock === "" || Number.isNaN(Number(form.stock))) return "Enter stock quantity.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: Number(form.compareAtPrice || 0),
      discountPct: Number(form.discountPct || 0),
      stock: Number(form.stock || 0),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="md:col-span-2 space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g., Premium Denim Jacket"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <input
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="px-3 py-2 border rounded-lg"
              placeholder="SKU (optional)"
            />
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-3 py-2 border rounded-lg"
              placeholder="Slug (optional)"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Product details, fabric, care, fit, etc."
          />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={pickImages} className="mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img.src} alt={img.name} className="h-28 w-full object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-xs px-2 py-1 bg-red-600 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow space-y-3">
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Category</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">Price (PKR) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Compare At (PKR)</label>
              <input
                type="number"
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Discount %</label>
              <input
                type="number"
                value={form.discountPct}
                onChange={(e) => setForm({ ...form, discountPct: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Stock *</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="mb-2 text-sm font-medium text-gray-700">Sizes</div>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleChoice("sizes", s)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  form.sizes.includes(s) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="mb-2 text-sm font-medium text-gray-700">Colors</div>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleChoice("colors", c)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  form.colors.includes(c) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          {busy ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
