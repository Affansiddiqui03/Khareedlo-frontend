// src/dashboard/AdminBrands.jsx
// REPLACE existing AdminBrands.jsx

import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  Store, Trash2, Globe, Phone, Mail, Star, Search,
  CheckCircle, XCircle, AlertTriangle, RefreshCw, Building2,
  Package, ShieldCheck, ExternalLink
} from "lucide-react";

function getInitials(name) {
  return (name || "?").split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

const GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-rose-500 to-red-700",
  "from-emerald-500 to-green-700",
  "from-sky-500 to-blue-700",
  "from-amber-500 to-orange-700",
];

function getGradient(name) {
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

const BRAND_LOGOS = {
  "J. By Junaid Jamshed": null, // will use initials fallback if no logo field
  "Zellbury": null,
  "Alkaram": null,
  "Limelight": null,
};

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [brandProducts, setBrandProducts] = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/brands");
      const data = res.ok ? await res.json() : [];
      setBrands(Array.isArray(data) ? data : []);
    } catch {
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandProductCount = async (brandId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/brand/products/${brandId}`);
      const data = res.ok ? await res.json() : [];
      setBrandProducts(prev => ({ ...prev, [brandId]: Array.isArray(data) ? data.length : 0 }));
    } catch {
      setBrandProducts(prev => ({ ...prev, [brandId]: 0 }));
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    brands.forEach(b => {
      if (brandProducts[b.brand_id] === undefined) {
        fetchBrandProductCount(b.brand_id);
      }
    });
  }, [brands]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/brands/${deleteTarget.brand_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setBrands(prev => prev.filter(b => b.brand_id !== deleteTarget.brand_id));
      showToast(`"${deleteTarget.brand_name}" and all its products have been removed from the platform.`);
    } catch {
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = brands.filter(b =>
    !search || b.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 max-w-sm ${
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
            <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
            <p className="text-gray-500 text-sm mt-1">
              {brands.length} active brand{brands.length !== 1 ? "s" : ""} on the platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search brands..."
                className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 w-56"
              />
            </div>
            <button onClick={fetchBrands}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Brand Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 flex flex-col items-center text-center">
            <Store className="w-12 h-12 text-gray-200 mb-3" />
            <p className="font-semibold text-gray-700">{search ? "No brands match your search" : "No active brands"}</p>
            <p className="text-gray-400 text-sm mt-1">Approved brands will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(brand => {
              const grad = getGradient(brand.brand_name);
              const productCount = brandProducts[brand.brand_id] ?? "—";
              const logoUrl = brand.logo ? `http://localhost:5000/${brand.logo}` : null;

              return (
                <div key={brand.brand_id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                  {/* Banner */}
                  <div className={`h-20 bg-gradient-to-br ${grad} relative`}>
                    <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white, transparent 70%)" }} />
                    {/* Logo */}
                    <div className="absolute -bottom-6 left-5 w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-white">
                      {logoUrl ? (
                        <img src={logoUrl} alt={brand.brand_name} className="w-full h-full object-contain"
                          onError={e => e.target.style.display = "none"} />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${grad}`}>
                          {getInitials(brand.brand_name)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pt-9 pb-5 flex-1 flex flex-col">
                    {/* Name & verified */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{brand.brand_name}</h3>
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3" /> Verified Brand
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-xs font-semibold">{brand.rating || "4.0"}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 my-3">
                      <p className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{brand.email}</span>
                      </p>
                      {(brand.contact || brand.phone) && (
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                          {brand.contact || brand.phone}
                        </p>
                      )}
                      {brand.city && (
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                          {brand.city}
                        </p>
                      )}
                      {brand.website && (
                        <a href={brand.website} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-violet-600 hover:underline">
                          <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{brand.website}</span>
                        </a>
                      )}
                    </div>

                    {/* Product count */}
                    <div className="flex items-center gap-2 py-2.5 border-t border-gray-50 mt-auto">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        <strong className="text-gray-800">{productCount}</strong> products listed
                      </span>
                      <a href={`/brands/${brand.brand_id}`} target="_blank" rel="noopener noreferrer"
                        className="ml-auto text-xs text-violet-600 hover:underline flex items-center gap-1">
                        View Page <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Delete btn */}
                    <button
                      onClick={() => setDeleteTarget(brand)}
                      className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl border border-red-100 text-red-500 text-sm font-medium hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Remove Brand
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ─────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5 mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center">Remove Brand?</h3>
            <p className="text-gray-500 text-sm text-center mt-2 leading-relaxed">
              You're about to permanently remove <strong className="text-gray-800">{deleteTarget.brand_name}</strong> from Khareedlo.
            </p>

            {/* Warning list */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-5 space-y-2">
              <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">This will permanently delete:</p>
              {[
                "Brand profile and login access",
                "All products listed by this brand",
                "Brand's page on the platform",
                "All associated POS data",
              ].map(item => (
                <p key={item} className="flex items-center gap-2 text-xs text-red-600">
                  <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {item}
                </p>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              ⚠️ A deletion notice will appear on the brand's dashboard if they log in.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Deleting...</>
                ) : (
                  <><Trash2 className="w-4 h-4" /> Yes, Delete Brand</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}