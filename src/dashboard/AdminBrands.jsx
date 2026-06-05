import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  Store, Trash2, Globe, Phone, Mail, Star, Search,
  CheckCircle, XCircle, AlertTriangle, RefreshCw, Building2,
  Package, ShieldCheck, ExternalLink, ImageIcon
} from "lucide-react";

const BASE = "https://khareedlo-backend-production.up.railway.app";

const GRADIENTS = [
  "from-violet-500 to-purple-700","from-rose-500 to-red-700",
  "from-emerald-500 to-green-700","from-sky-500 to-blue-700",
  "from-amber-500 to-orange-700",
];
function getGradient(name) {
  let h = 0;
  for (let i = 0; i < (name||"").length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}
function getInitials(name) {
  return (name||"?").split(" ").filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join("");
}

export default function AdminBrands() {
  const [brands,       setBrands]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [toast,        setToast]        = useState(null);
  const [productCounts,setProductCounts]= useState({});

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

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
        .then(data => setProductCounts(prev => ({ ...prev, [b.brand_id]: Array.isArray(data) ? data.length : 0 })))
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
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 max-w-xs ${
          toast.type==="error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type==="error" ? <XCircle className="w-4 h-4 flex-shrink-0"/> : <CheckCircle className="w-4 h-4 flex-shrink-0"/>}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Brands</h1>
            <p className="text-gray-500 text-sm mt-0.5">{brands.length} active brand{brands.length!==1?"s":""} on the platform</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search brands..."
                className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 w-full sm:w-52" />
            </div>
            <button onClick={fetchBrands} className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 flex-shrink-0">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4].map(i=><div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100"/>)}
          </div>
        ) : filtered.length===0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 flex flex-col items-center text-center">
            <Store className="w-12 h-12 text-gray-200 mb-3"/>
            <p className="font-semibold text-gray-700">{search?"No brands match":"No active brands"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(brand => {
              const grad = getGradient(brand.brand_name);
              const logoUrl = brand.logo ? `${BASE}/${brand.logo}` : null;
              const bannerUrl = brand.banner ? `${BASE}/${brand.banner}` : null;

              return (
                <div key={brand.brand_id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                  {/* Banner */}
                  <div className={`h-24 sm:h-28 relative overflow-hidden ${bannerUrl ? "" : `bg-gradient-to-br ${grad}`}`}>
                    {bannerUrl ? (
                      <img src={bannerUrl} alt="banner" className="w-full h-full object-cover"
                        onError={e => { e.target.style.display="none"; e.target.parentNode.classList.add(`bg-gradient-to-br`, ...grad.split(" ")); }} />
                    ) : (
                      <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 20% 50%, white, transparent 70%)"}}/>
                    )}
                    {/* Logo */}
                    <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-white">
                      {logoUrl ? (
                        <img src={logoUrl} alt={brand.brand_name} className="w-full h-full object-contain"
                          onError={e => { e.target.style.display="none"; }} />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${grad}`}>
                          {getInitials(brand.brand_name)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pt-9 pb-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 leading-tight truncate">{brand.brand_name}</h3>
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3"/> Verified
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400"/>
                        <span className="text-xs font-semibold">{brand.rating||"4.0"}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <p className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0"/><span className="truncate">{brand.email}</span>
                      </p>
                      {brand.contact && <p className="flex items-center gap-2 text-xs text-gray-500"><Phone className="w-3.5 h-3.5 flex-shrink-0"/>{brand.contact}</p>}
                      {brand.city && <p className="flex items-center gap-2 text-xs text-gray-500"><Building2 className="w-3.5 h-3.5 flex-shrink-0"/>{brand.city}</p>}
                      {brand.website && (
                        <a href={brand.website} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-violet-600 hover:underline">
                          <Globe className="w-3.5 h-3.5 flex-shrink-0"/><span className="truncate">{brand.website}</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 py-2.5 border-t border-gray-50 mt-auto">
                      <Package className="w-4 h-4 text-gray-400"/>
                      <span className="text-xs text-gray-500">
                        <strong className="text-gray-800">{productCounts[brand.brand_id]??"-"}</strong> products
                      </span>
                      <a href={`/brands/${brand.brand_id}`} target="_blank" rel="noopener noreferrer"
                        className="ml-auto text-xs text-violet-600 hover:underline flex items-center gap-1">
                        View <ExternalLink className="w-3 h-3"/>
                      </a>
                    </div>

                    <button onClick={()=>setDeleteTarget(brand)}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl border border-red-100 text-red-500 text-xs sm:text-sm font-medium hover:bg-red-50 transition">
                      <Trash2 className="w-3.5 h-3.5"/> Remove Brand
                    </button>
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
          <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl p-6 sm:p-8">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-7 h-7 text-red-500"/>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center">Remove Brand?</h3>
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
