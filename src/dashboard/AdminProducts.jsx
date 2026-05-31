// src/dashboard/AdminProducts.jsx  (NEW FILE)

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import {
  Box, Search, Trash2, Filter, RefreshCw,
  CheckCircle, XCircle, ImageIcon, Package, AlertTriangle
} from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/admin/products");
      const data = res.ok ? await res.json() : [];
      // Only show APPROVED ones on this page (pending go to approvals)
      const approved = (Array.isArray(data) ? data : []).filter(p => p.status === "APPROVED");
      setProducts(approved);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const brands = useMemo(() => {
    const names = [...new Set(products.map(p => p.brand_name).filter(Boolean))];
    return ["All", ...names.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search ||
        p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.brand_name?.toLowerCase().includes(search.toLowerCase());
      const matchBrand = brandFilter === "All" || p.brand_name === brandFilter;
      return matchSearch && matchBrand;
    });
  }, [products, search, brandFilter]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`https://khareedlo-backend-production.up.railway.app/api/admin/products/${deleteTarget.product_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts(prev => prev.filter(p => p.product_id !== deleteTarget.product_id));
      showToast(`"${deleteTarget.product_name}" deleted successfully.`);
    } catch {
      showToast("Delete failed. Try again.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout>
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Products</h1>
            <p className="text-gray-500 text-sm mt-1">{filtered.length} products publicly visible on the platform</p>
          </div>
          <button onClick={fetchProducts}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 self-start">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={brandFilter}
              onChange={e => setBrandFilter(e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
            >
              {brands.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center">
              <Package className="w-12 h-12 text-gray-200 mb-3" />
              <p className="font-semibold text-gray-700">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Brand</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Category</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => (
                    <tr key={p.product_id} className="hover:bg-gray-50/50 transition-colors group">
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                            {p.image && p.image !== "photos/" ? (
                              <img
                                src={`https://khareedlo-backend-production.up.railway.app/${p.image}`}
                                alt={p.product_name}
                                className="w-full h-full object-cover"
                                onError={e => { e.target.style.display = "none"; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 line-clamp-1 max-w-[200px]">{p.product_name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{p.gender || "—"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="font-medium text-gray-700">{p.brand_name}</span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 font-medium">
                          {p.category_name || p.gender || "—"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-gray-900">PKR {Number(p.price).toLocaleString()}</span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Live
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-7">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center">Delete Product?</h3>
            <p className="text-gray-500 text-sm text-center mt-2">
              <strong className="text-gray-800">"{deleteTarget.product_name}"</strong> will be removed from the platform permanently.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting ? "Deleting..." : <><Trash2 className="w-4 h-4" /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}