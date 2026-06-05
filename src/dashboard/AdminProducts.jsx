import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import {
  Search, Trash2, RefreshCw,
  CheckCircle, XCircle, ImageIcon, Package, AlertTriangle, Store
} from "lucide-react";

const BASE = "https://khareedlo-backend-production.up.railway.app";

export default function AdminProducts() {
  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [brandFilter,   setBrandFilter]   = useState("All");
  const [statusFilter,  setStatusFilter]  = useState("APPROVED");
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/admin/products`);
      const data = res.ok ? await res.json() : [];
      setProducts(Array.isArray(data) ? data : []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
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
      const matchBrand  = brandFilter === "All" || p.brand_name === brandFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchBrand && matchStatus;
    });
  }, [products, search, brandFilter, statusFilter]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${BASE}/api/admin/products/${deleteTarget.product_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts(prev => prev.filter(p => p.product_id !== deleteTarget.product_id));
      showToast(`"${deleteTarget.product_name}" deleted.`);
    } catch { showToast("Delete failed. Try again.", "error"); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const getImageSrc = (image) => {
    if (!image || image === "photos/") return null;
    if (image.startsWith("http")) return image; // Cloudinary full URL
    return `${BASE}/${image}`;
  };

  const statusBadge = (status) => {
    const map = {
      APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      PENDING:  "bg-amber-50 text-amber-700 border-amber-200",
      REJECTED: "bg-red-50 text-red-600 border-red-200",
    };
    return map[status] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <AdminLayout>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 max-w-xs ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          <span className="line-clamp-2">{toast.msg}</span>
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-500 text-sm mt-0.5">{filtered.length} products shown</p>
          </div>
          <button onClick={fetchProducts}
            className="self-start p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200" />
          </div>
          {/* Brand filter */}
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-200">
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>
          {/* Status filter */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-200">
            <option value="All">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-56 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 flex flex-col items-center text-center">
            <Package className="w-12 h-12 text-gray-200 mb-3" />
            <p className="font-semibold text-gray-700">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => {
              const imgSrc = getImageSrc(p.image);
              return (
                <div key={p.product_id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                  {/* Image */}
                  <div className="relative h-44 bg-gray-50 overflow-hidden">
                    {imgSrc ? (
                      <img src={imgSrc} alt={p.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                    ) : null}
                    <div className={`w-full h-full flex-col items-center justify-center text-gray-300 ${imgSrc ? "hidden" : "flex"}`}>
                      <ImageIcon className="w-10 h-10 mb-1" />
                      <span className="text-xs">No image</span>
                    </div>
                    {/* Status badge */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(p.status)}`}>
                      {p.status}
                    </div>
                    {/* Delete btn on hover */}
                    <button onClick={() => setDeleteTarget(p)}
                      className="absolute top-2 left-2 p-1.5 rounded-xl bg-white/90 text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex-1 flex flex-col">
                    <p className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight">{p.product_name}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Store className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500 truncate">{p.brand_name}</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                      <span className="font-bold text-gray-900 text-sm">PKR {Number(p.price).toLocaleString()}</span>
                      <span className="text-xs text-gray-400">{p.gender}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 sm:p-7">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center">Delete Product?</h3>
            <p className="text-gray-500 text-sm text-center mt-2">
              <strong className="text-gray-800">"{deleteTarget.product_name}"</strong> will be permanently removed.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                className="flex-1 py-2.5 sm:py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="flex-1 py-2.5 sm:py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting ? "Deleting..." : <><Trash2 className="w-4 h-4" /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
