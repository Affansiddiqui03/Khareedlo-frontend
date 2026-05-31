// src/pages/brand/Products.jsx
// FIXED:
// 1. Images now show correctly — handles localhost path, Shopify CDN, and no-image fallback
// 2. Product card layout preserved exactly as before
// 3. onError fallback added so broken images never show blank boxes

import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Plus, Trash2, Eye, X, Upload, CheckCircle,
  AlertCircle, Clock, Package, ImageIcon, Tag,
  Globe, ChevronDown, Loader2,
} from "lucide-react";

const IMG_BASE = "http://localhost:5000";

const STATUS_CONFIG = {
  APPROVED: { label: "Live",    bg: "bg-emerald-50", color: "text-emerald-700", icon: CheckCircle },
  PENDING:  { label: "Pending", bg: "bg-amber-50",   color: "text-amber-700",   icon: Clock       },
  REJECTED: { label: "Rejected",bg: "bg-red-50",     color: "text-red-700",     icon: AlertCircle },
};

const emptyForm = {
  product_name: "", price: "", category_id: "1", sub_category_id: "1",
  gender: "Women", buy_now_link: "", website_link: "", image: null,
};

// ── Resolve any image path to a displayable src ───────────────
function resolveImg(image) {
  if (!image) return null;
  if (image === "photos/" || image === "") return null;
  if (image.startsWith("http")) return image;            // Shopify CDN or external
  return `${IMG_BASE}/${image}`;                         // local upload
}

export default function Products() {
  const { theme, brandId } = useOutletContext();

  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg,  setSubmitMsg]  = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchProducts = async () => {
    if (!brandId) return;
    setLoading(true);
    try {
      const res = await fetch(`${IMG_BASE}/api/brand/products/${brandId}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [brandId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.product_name.trim() || !form.price) {
      setSubmitMsg({ type: "error", text: "Product name and price are required." });
      return;
    }
    if (!form.buy_now_link.trim()) {
      setSubmitMsg({ type: "error", text: "Buy Now Link is required so customers can be redirected." });
      return;
    }

    setSubmitting(true);
    setSubmitMsg(null);

    try {
      const fd = new FormData();
      fd.append("brand_id",       brandId);
      fd.append("product_name",   form.product_name.trim());
      fd.append("price",          form.price);
      fd.append("category_id",    form.category_id);
      fd.append("sub_category_id",form.sub_category_id);
      fd.append("gender",         form.gender);
      fd.append("buy_now_link",   form.buy_now_link.trim());
      fd.append("website_link",   form.website_link.trim());
      if (form.image) fd.append("image", form.image);

      const res = await fetch(`${IMG_BASE}/api/brand/add-product`, { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.message?.toLowerCase().includes("fail")) {
        throw new Error(data.message || "Failed to add product");
      }

      setSubmitMsg({ type: "success", text: "Product submitted! Pending admin approval." });
      setForm(emptyForm);
      setPreview(null);
      setTimeout(() => { setShowModal(false); setSubmitMsg(null); fetchProducts(); }, 1800);
    } catch (err) {
      setSubmitMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`${IMG_BASE}/api/brand/products/${deleteId}`, { method: "DELETE" });
      setProducts(prev => prev.filter(p => (p.product_id || p.id) !== deleteId));
    } catch {}
    finally { setDeleteId(null); }
  };

  const filtered = filterStatus === "ALL"
    ? products
    : products.filter(p => (p.status || "PENDING") === filterStatus);

  const counts = {
    ALL:      products.length,
    APPROVED: products.filter(p => p.status === "APPROVED").length,
    PENDING:  products.filter(p => p.status === "PENDING").length,
    REJECTED: products.filter(p => p.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => { setShowModal(true); setForm(emptyForm); setPreview(null); setSubmitMsg(null); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[["ALL","All"],["APPROVED","Live"],["PENDING","Pending"],["REJECTED","Rejected"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilterStatus(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filterStatus === val
                ? "text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={filterStatus === val ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` } : {}}>
            {label} ({counts[val]})
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse">
              <div className="h-48 bg-gray-100 rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                <div className="h-8 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No products found</p>
          <p className="text-gray-400 text-sm mt-1">
            {filterStatus === "ALL" ? "Click Add Product to get started" : `No ${filterStatus.toLowerCase()} products`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => {
            const id       = item.product_id || item.id;
            const status   = item.status || "PENDING";
            const cfg      = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
            const StatusIcon = cfg.icon;
            const imgSrc   = resolveImg(item.image);

            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">

                {/* Image */}
                <div className="h-48 bg-gray-50 overflow-hidden relative">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  {/* Fallback — always rendered, hidden by default when image loads */}
                  <div
                    className="w-full h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50"
                    style={{ display: imgSrc ? "none" : "flex" }}
                  >
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                  </div>

                  {/* Status badge */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
                    {item.product_name || item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold" style={{ color: theme.accent }}>
                      PKR {Number(item.price).toLocaleString()}
                    </span>
                    {item.gender && (
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        {item.gender}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    {item.buy_now_link && (
                      <a
                        href={item.buy_now_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </a>
                    )}
                    <button
                      onClick={() => setDeleteId(id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ADD PRODUCT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Product</h3>
                <p className="text-xs text-gray-400 mt-0.5">Submitted products need admin approval before going live</p>
              </div>
              <button onClick={() => { setShowModal(false); setForm(emptyForm); setPreview(null); setSubmitMsg(null); }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Submit status */}
              {submitMsg && (
                <div className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
                  submitMsg.type === "error"
                    ? "bg-red-50 border border-red-100 text-red-700"
                    : "bg-emerald-50 border border-emerald-100 text-emerald-700"
                }`}>
                  {submitMsg.type === "error"
                    ? <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    : <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                  {submitMsg.text}
                </div>
              )}

              {/* Image upload */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Product Image</label>
                <label className="cursor-pointer block">
                  <div className={`border-2 border-dashed rounded-2xl overflow-hidden transition-colors ${
                    preview ? "border-transparent" : "border-gray-200 hover:border-gray-300"
                  }`}>
                    {preview ? (
                      <div className="relative">
                        <img src={preview} alt="preview" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                          <p className="text-white text-sm font-semibold">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-36 flex flex-col items-center justify-center gap-2 text-gray-400">
                        <Upload className="w-8 h-8" />
                        <p className="text-sm">Click to upload product image</p>
                        <p className="text-xs">JPG, PNG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>

              {/* Product name */}
              <Field label="Product Name *">
                <input type="text" value={form.product_name}
                  onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
                  placeholder="e.g. Embroidered Lawn Suit 3PC"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                  style={{ "--tw-ring-color": theme.accent + "44" }}
                />
              </Field>

              {/* Price + Gender */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (PKR) *">
                  <input type="number" value={form.price} min={0}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. 4500"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": theme.accent + "44" }}
                  />
                </Field>

                <Field label="Category">
                  <select value={form.gender}
                    onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                    {["Women","Men","Kids","Unisex"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </Field>
              </div>

              {/* Buy Now Link — REQUIRED */}
              <Field label="Buy Now Link (Product URL on your website) *">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="url" value={form.buy_now_link}
                    onChange={e => setForm(f => ({ ...f, buy_now_link: e.target.value }))}
                    placeholder="https://yourstore.com/products/this-product"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": theme.accent + "44" }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Customers will be redirected here when they click "Buy Now". Required for redirect to work.
                </p>
              </Field>

              {/* Brand Website */}
              <Field label="Brand Website (Optional)">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="url" value={form.website_link}
                    onChange={e => setForm(f => ({ ...f, website_link: e.target.value }))}
                    placeholder="https://yourstore.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": theme.accent + "44" }}
                  />
                </div>
              </Field>

              {/* Submit button */}
              <button onClick={handleSubmit} disabled={submitting}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}>
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                  : <><Plus className="w-4 h-4" /> Submit for Approval</>}
              </button>

              <p className="text-xs text-center text-gray-400">
                Product will be reviewed by Khareedlo admin before going live
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}