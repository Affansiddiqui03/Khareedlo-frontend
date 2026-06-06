import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { brandAssets } from "../data/brandAssets";
import {
  Store, Trash2, Globe, Phone, Mail, Star, Search,
  CheckCircle, XCircle, AlertTriangle, RefreshCw,
  Package, ShieldCheck, ExternalLink, Building2
} from "lucide-react";

const BASE = "https://khareedlo-backend-production.up.railway.app";

const GRADIENTS = [
  ["#7C3AED","#5B21B6"],
  ["#E11D48","#9F1239"],
  ["#059669","#065F46"],
  ["#0284C7","#0C4A6E"],
  ["#D97706","#92400E"],
];
function getGrad(name) {
  let h = 0;
  for (let i = 0; i < (name||"").length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}
function getInitials(name) {
  return (name||"?").split(" ").filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join("");
}
function imgSrc(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE}/${url}`;
}

export default function AdminBrands() {
  const [brands,        setBrands]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [toast,         setToast]         = useState(null);
  const [productCounts, setProductCounts] = useState({});

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 3500);
  };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/admin/brands`);
      const data = res.ok ? await res.json() : [];
      setBrands(Array.isArray(data) ? data : []);
    } catch { setBrands([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBrands(); }, []);

  useEffect(() => {
    brands.forEach(b => {
      if (productCounts[b.brand_id] !== undefined) return;
      fetch(`${BASE}/api/brand/products/${b.brand_id}`)
        .then(r => r.ok ? r.json() : [])
        .then(data => setProductCounts(prev => ({
          ...prev, [b.brand_id]: Array.isArray(data) ? data.length : 0
        })))
        .catch(() => setProductCounts(prev => ({ ...prev, [b.brand_id]: 0 })));
    });
  }, [brands]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${BASE}/api/admin/brands/${deleteTarget.brand_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setBrands(prev => prev.filter(b => b.brand_id !== deleteTarget.brand_id));
      showToast(`"${deleteTarget.brand_name}" removed.`);
    } catch { showToast("Delete failed.", "error"); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const filtered = brands.filter(b =>
    !search ||
    b.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 max-w-xs ${
          toast.type==="error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type==="error"
            ? <XCircle className="w-4 h-4 flex-shrink-0"/>
            : <CheckCircle className="w-4 h-4 flex-shrink-0"/>}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Brands</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {brands.length} active brand{brands.length!==1?"s":""} on the platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search brands..."
                className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 w-full sm:w-52"
              />
            </div>
            <button onClick={fetchBrands}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 flex-shrink-0">
              <RefreshCw className="w-4 h-4"/>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i=>(
              <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100"/>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 flex flex-col items-center text-center">
            <Store className="w-12 h-12 text-gray-200 mb-3"/>
            <p className="font-semibold text-gray-700">{search ? "No brands match" : "No active brands"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(brand => {
              const [c1, c2] = getGrad(brand.brand_name);
              // Cloudinary URL or static asset fallback for old 4 brands
              const { brandAssets: ba } = { brandAssets: {} }; // dummy
              const staticAsset = brandAssets[brand.brand_name] || {};
              const dbLogo = brand.logo && brand.logo.startsWith("http") ? brand.logo : null;
              const logo = dbLogo || staticAsset.logo || null;
              const dbBanner = brand.banner && brand.banner.startsWith("http") ? brand.banner : null;
              const banner = dbBanner || staticAsset.banner || null;
              const count    = productCounts[brand.brand_id];

              return (
                <div key={brand.brand_id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">

                  {/* Top coloured strip with logo */}
                  {/* Banner image or gradient */}
                  {banner && (
                    <div className="h-20 w-full overflow-hidden">
                      <img src={banner} alt="banner" className="w-full h-full object-cover"
                        onError={e => e.target.parentNode.style.display="none"} />
                    </div>
                  )}
                  <div className={`flex items-center gap-4 px-4 py-4 ${banner ? "" : ""}`}
                    style={{background: banner ? "transparent" : `linear-gradient(135deg, ${c1}, ${c2})`}}>

                    {/* Logo circle */}
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0 overflow-hidden flex items-center justify-center border-2 border-white/40 shadow">
                      {logo ? (
                        <img src={logo} alt={brand.brand_name}
                          className="w-full h-full object-contain bg-white"
                          onError={e => {
                            e.target.style.display="none";
                            e.target.nextSibling.style.display="flex";
                          }}/>
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center text-white font-bold text-xl ${logo ? "hidden" : "flex"}`}>
                        {getInitials(brand.brand_name)}
                      </div>
                    </div>

                    {/* Name + rating */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base leading-tight truncate">
                        {brand.brand_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-xs text-white font-medium">
                          <ShieldCheck className="w-3 h-3"/> Verified
                        </span>
                        <span className="flex items-center gap-1 text-amber-200 text-xs font-semibold">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300"/>
                          {brand.rating || "4.0"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info section */}
                  <div className="px-4 py-3 flex-1 flex flex-col gap-2">
                    <div className="space-y-1.5">
                      <p className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"/>
                        <span className="truncate">{brand.email}</span>
                      </p>
                      {brand.contact && (
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"/>
                          {brand.contact}
                        </p>
                      )}
                      {brand.city && (
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                          <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"/>
                          {brand.city}
                        </p>
                      )}
                      {brand.website && (
                        <a href={brand.website} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-violet-600 hover:underline">
                          <Globe className="w-3.5 h-3.5 flex-shrink-0"/>
                          <span className="truncate">{brand.website}</span>
                        </a>
                      )}
                    </div>

                    {/* Products row + View link */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50 mt-auto">
                      <Package className="w-4 h-4 text-gray-400"/>
                      <span className="text-xs text-gray-500">
                        <strong className="text-gray-800">{count ?? "—"}</strong> products
                      </span>
                      <a href={`/brands/${brand.brand_id}`} target="_blank" rel="noopener noreferrer"
                        className="ml-auto text-xs text-violet-600 hover:underline flex items-center gap-1 font-medium">
                        View <ExternalLink className="w-3 h-3"/>
                      </a>
                    </div>

                    {/* Remove button */}
                    <button onClick={()=>setDeleteTarget(brand)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-100 text-red-500 text-xs font-semibold hover:bg-red-50 transition mt-1">
                      <Trash2 className="w-3.5 h-3.5"/> Remove Brand
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 sm:p-8">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-7 h-7 text-red-500"/>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center">Remove Brand?</h3>
            <p className="text-gray-500 text-sm text-center mt-2">
              Permanently removing <strong className="text-gray-800">{deleteTarget.brand_name}</strong> and all its products.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setDeleteTarget(null)} disabled={deleting}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting ? "Deleting..." : <><Trash2 className="w-4 h-4"/>Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}