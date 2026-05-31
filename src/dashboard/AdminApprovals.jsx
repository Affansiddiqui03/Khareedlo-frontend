// src/dashboard/AdminApprovals.jsx  (NEW FILE — replaces PendingProducts.jsx)

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import {
  ShieldCheck, Search, Filter, RefreshCw, CheckCircle, XCircle,
  Clock, Eye, Package, ImageIcon, Globe, ExternalLink, AlertTriangle
} from "lucide-react";

const STATUS_CFG = {
  PENDING:  { label: "Pending",  cls: "bg-amber-50 text-amber-700 border-amber-200",  icon: Clock },
  APPROVED: { label: "Approved", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  REJECTED: { label: "Rejected", cls: "bg-red-50 text-red-600 border-red-200",        icon: XCircle },
};

export default function AdminApprovals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
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

  const handleAction = async (productId, status) => {
    setProcessing(productId + status);
    try {
      const res = await fetch(`https://khareedlo-backend-production.up.railway.app/api/admin/products/${productId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setProducts(prev => prev.map(p => p.product_id === productId ? { ...p, status } : p));
      showToast(
        status === "APPROVED"
          ? "Product approved! It's now live on the platform. ✅"
          : "Product rejected.",
        status === "APPROVED" ? "success" : "error"
      );
      if (preview?.product_id === productId) setPreview(prev => ({ ...prev, status }));
    } catch {
      showToast("Action failed. Try again.", "error");
    } finally {
      setProcessing(null);
    }
  };

  const counts = useMemo(() => ({
    PENDING:  products.filter(p => p.status === "PENDING").length,
    APPROVED: products.filter(p => p.status === "APPROVED").length,
    REJECTED: products.filter(p => p.status === "REJECTED").length,
  }), [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchTab = tab === "ALL" || p.status === tab;
      const matchSearch = !search ||
        p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.brand_name?.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [products, tab, search]);

  const TABS = ["PENDING", "APPROVED", "REJECTED", "ALL"];

  return (
    <AdminLayout>
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 max-w-xs ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Approvals</h1>
            <p className="text-gray-500 text-sm mt-1">Review brand-submitted products before they go live</p>
          </div>
          <button onClick={fetchProducts}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 self-start">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Pending alert */}
        {counts.PENDING > 0 && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              <strong>{counts.PENDING} product{counts.PENDING > 1 ? "s" : ""}</strong> waiting for review.
              Approved products immediately appear on the public Products page and the brand's detail page.
            </p>
          </div>
        )}

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "ALL" ? "All" : t[0] + t.slice(1).toLowerCase()}
                {t !== "ALL" && counts[t] > 0 && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    t === "PENDING"  ? "bg-amber-100 text-amber-700"   :
                    t === "APPROVED" ? "bg-emerald-100 text-emerald-700" :
                    "bg-red-100 text-red-700"
                  }`}>{counts[t]}</span>
                )}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search product or brand..."
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />
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
              <p className="font-semibold text-gray-700">
                {tab === "PENDING" ? "All caught up! No pending products." : `No ${tab.toLowerCase()} products.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Brand</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Price</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Links</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => {
                    const cfg = STATUS_CFG[p.status] || STATUS_CFG.PENDING;
                    const StatusIcon = cfg.icon;
                    const isProc = processing === p.product_id + "APPROVED" || processing === p.product_id + "REJECTED";

                    return (
                      <tr key={p.product_id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Product */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                              {p.image && p.image !== "photos/" ? (
                                <img src={`https://khareedlo-backend-production.up.railway.app/${p.image}`} alt={p.product_name}
                                  className="w-full h-full object-cover"
                                  onError={e => e.target.style.display = "none"} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-5 h-5 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 line-clamp-1 max-w-[180px]">{p.product_name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{p.gender} · {p.category_name || "—"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Brand */}
                        <td className="px-6 py-4 hidden md:table-cell font-medium text-gray-700">{p.brand_name}</td>

                        {/* Price */}
                        <td className="px-6 py-4 text-center hidden lg:table-cell font-bold text-gray-900">
                          PKR {Number(p.price).toLocaleString()}
                        </td>

                        {/* Links */}
                        <td className="px-6 py-4 text-center hidden lg:table-cell">
                          <div className="flex items-center justify-center gap-2">
                            {p.website_link && (
                              <a href={p.website_link} target="_blank" rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Brand Website">
                                <Globe className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {p.buy_now_link && (
                              <a href={p.buy_now_link} target="_blank" rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100" title="Product Link">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button onClick={() => setPreview(p)}
                              className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100" title="Full Preview">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
                            <StatusIcon className="w-3 h-3" /> {cfg.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          {p.status === "PENDING" ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleAction(p.product_id, "APPROVED")}
                                disabled={isProc}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> {isProc ? "..." : "Approve"}
                              </button>
                              <button
                                onClick={() => handleAction(p.product_id, "REJECTED")}
                                disabled={isProc}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 disabled:opacity-50 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" /> {isProc ? "..." : "Reject"}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAction(p.product_id, "PENDING")}
                              disabled={!!processing}
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
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="h-64 bg-gray-100 overflow-hidden">
              {preview.image && preview.image !== "photos/" ? (
                <img src={`https://khareedlo-backend-production.up.railway.app/${preview.image}`} alt={preview.product_name}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{preview.product_name}</h3>
                  <p className="text-sm text-violet-600 font-medium mt-0.5">{preview.brand_name}</p>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${(STATUS_CFG[preview.status] || STATUS_CFG.PENDING).cls}`}>
                  {preview.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Price</p>
                  <p className="font-bold text-gray-900">PKR {Number(preview.price).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Gender</p>
                  <p className="font-semibold text-gray-700">{preview.gender || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Category</p>
                  <p className="font-semibold text-gray-700">{preview.category_name || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Sub-Category</p>
                  <p className="font-semibold text-gray-700">{preview.sub_category_name || "—"}</p>
                </div>
              </div>

              <div className="space-y-2">
                {preview.website_link && (
                  <a href={preview.website_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Globe className="w-4 h-4 flex-shrink-0" /><span className="truncate">{preview.website_link}</span>
                  </a>
                )}
                {preview.buy_now_link && (
                  <a href={preview.buy_now_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:underline">
                    <ExternalLink className="w-4 h-4 flex-shrink-0" /> View product on brand website
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {preview.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => { handleAction(preview.product_id, "APPROVED"); setPreview(null); }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
                    >✓ Approve</button>
                    <button
                      onClick={() => { handleAction(preview.product_id, "REJECTED"); setPreview(null); }}
                      className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-bold hover:bg-red-100"
                    >✕ Reject</button>
                  </>
                )}
                <button onClick={() => setPreview(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}