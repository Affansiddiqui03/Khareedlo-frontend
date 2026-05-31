// src/dashboard/PendingProducts.jsx
import React, { useEffect, useState } from "react";
import {
  CheckCircle, XCircle, Clock, Eye, Package,
  Globe, ExternalLink, RefreshCw, Search, AlertTriangle
} from "lucide-react";

const STATUS_BADGE = {
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  APPROVED: { label: "Approved", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  REJECTED: { label: "Rejected", cls: "bg-red-50 text-red-700 border-red-200" },
};

export default function PendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/admin/pending-products");
      const data = res.ok ? await res.json() : [];
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAction = async (productId, action) => {
    setProcessingId(productId);
    try {
      const res = await fetch(`https://khareedlo-backend-production.up.railway.app/api/admin/products/${productId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error();
      setProducts(prev =>
        prev.map(p => (p.product_id === productId ? { ...p, status: action } : p))
      );
      showToast(`Product ${action === "APPROVED" ? "approved and is now live!" : "rejected."}`,
        action === "APPROVED" ? "success" : "error");
    } catch {
      showToast("Action failed. Try again.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = products.filter(p => {
    const matchFilter = filter === "ALL" ? true : p.status === filter;
    const matchSearch = search
      ? (p.product_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.brand_name || "").toLowerCase().includes(search.toLowerCase())
      : true;
    return matchFilter && matchSearch;
  });

  const counts = {
    PENDING: products.filter(p => p.status === "PENDING").length,
    APPROVED: products.filter(p => p.status === "APPROVED").length,
    REJECTED: products.filter(p => p.status === "REJECTED").length,
  };

  return (
    <div className="p-6 space-y-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve brand-submitted products before they go live</p>
        </div>
        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              {tab !== "ALL" && counts[tab] > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  tab === "PENDING" ? "bg-amber-100 text-amber-700" :
                  tab === "APPROVED" ? "bg-emerald-100 text-emerald-700" :
                  "bg-red-100 text-red-700"
                }`}>{counts[tab]}</span>
              )}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search product or brand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
          />
        </div>
      </div>

      {/* Pending Alert */}
      {counts.PENDING > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            <strong>{counts.PENDING} product{counts.PENDING > 1 ? "s" : ""}</strong> waiting for your review.
            Approved products appear on the public Products page and the brand's detail page.
          </p>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {[1,2,3].map(i => (
            <div key={i} className="p-5 flex gap-4 animate-pulse">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 flex flex-col items-center text-center">
          <Package className="w-12 h-12 text-gray-200 mb-3" />
          <h3 className="text-gray-600 font-semibold">No products found</h3>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "PENDING" ? "All caught up! No pending reviews." : `No ${filter.toLowerCase()} products.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Brand</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Price</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Links</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(product => {
                const badge = STATUS_BADGE[product.status] || STATUS_BADGE.PENDING;
                const isProcessing = processingId === product.product_id;
                return (
                  <tr key={product.product_id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Product info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                          {product.image ? (
                            <img
                              src={`https://khareedlo-backend-production.up.railway.app/${product.image}`}
                              alt={product.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm line-clamp-1 max-w-[200px]">{product.product_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.gender} · {product.category_name || "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="font-medium text-gray-700">{product.brand_name}</span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-center hidden lg:table-cell">
                      <span className="font-bold text-gray-900">PKR {Number(product.price).toLocaleString()}</span>
                    </td>

                    {/* Links */}
                    <td className="px-5 py-4 text-center hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-2">
                        {product.website_link && (
                          <a href={product.website_link} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Brand Website">
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {product.buy_now_link && (
                          <a href={product.buy_now_link} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="Product Page">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button onClick={() => setPreviewProduct(product)}
                          className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors" title="Preview">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.cls}`}>
                        {product.status === "PENDING" && <Clock className="w-3 h-3" />}
                        {product.status === "APPROVED" && <CheckCircle className="w-3 h-3" />}
                        {product.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                        {badge.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-center">
                      {product.status === "PENDING" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleAction(product.product_id, "APPROVED")}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {isProcessing ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleAction(product.product_id, "REJECTED")}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 border border-red-200 disabled:opacity-50 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            {isProcessing ? "..." : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAction(product.product_id, "PENDING")}
                          disabled={isProcessing}
                          className="text-xs text-gray-400 hover:text-gray-600 underline disabled:opacity-50"
                        >
                          Reset to Pending
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {previewProduct.image ? (
              <img
                src={`https://khareedlo-backend-production.up.railway.app/${previewProduct.image}`}
                alt={previewProduct.product_name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
            )}
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-gray-900">{previewProduct.product_name}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Brand</p>
                  <p className="font-semibold text-gray-700">{previewProduct.brand_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Price</p>
                  <p className="font-bold text-gray-900">PKR {Number(previewProduct.price).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Category</p>
                  <p className="font-semibold text-gray-700">{previewProduct.category_name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Gender</p>
                  <p className="font-semibold text-gray-700">{previewProduct.gender}</p>
                </div>
              </div>
              {previewProduct.website_link && (
                <a href={previewProduct.website_link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <Globe className="w-4 h-4" /> {previewProduct.website_link}
                </a>
              )}
              {previewProduct.buy_now_link && (
                <a href={previewProduct.buy_now_link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-purple-600 hover:underline">
                  <ExternalLink className="w-4 h-4" /> Product Buy Link
                </a>
              )}
              <div className="flex gap-3 pt-2">
                {previewProduct.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => { handleAction(previewProduct.product_id, "APPROVED"); setPreviewProduct(null); }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => { handleAction(previewProduct.product_id, "REJECTED"); setPreviewProduct(null); }}
                      className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-200 hover:bg-red-100"
                    >
                      ✕ Reject
                    </button>
                  </>
                )}
                <button onClick={() => setPreviewProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}