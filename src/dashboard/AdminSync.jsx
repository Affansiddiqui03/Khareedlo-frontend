// src/dashboard/AdminSync.jsx
// Admin page to manually trigger brand sync + view sync logs

import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  RefreshCw, CheckCircle, XCircle, Clock,
  Package, AlertTriangle, Zap, Database,
  ArrowDownCircle,
} from "lucide-react";

const BRANDS = [
  { key: "zellbury", label: "Zellbury",       color: "#1A4731", icon: "Z" },
  { key: "alkaram",  label: "Alkaram Studio",  color: "#5B1F7A", icon: "A" },
  { key: "limelight",label: "Limelight",       color: "#B45309", icon: "L" },
];

function SyncCard({ brand, onSync, syncing, lastResult }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-2" style={{ background: brand.color }} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl text-white font-black text-lg flex items-center justify-center"
              style={{ background: brand.color }}>
              {brand.icon}
            </div>
            <div>
              <p className="font-extrabold text-gray-900">{brand.label}</p>
              <p className="text-xs text-gray-400">Shopify Store</p>
            </div>
          </div>

          <button
            onClick={() => onSync(brand.key)}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold disabled:opacity-50 transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: syncing ? "#9CA3AF" : brand.color }}
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Sync Now"}
          </button>
        </div>

        {lastResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {[
              { label: "Total Fetched", val: lastResult.total,       icon: Package,      color: "text-gray-700" },
              { label: "New Added",     val: lastResult.inserted,     icon: ArrowDownCircle, color: "text-emerald-600" },
              { label: "Updated",       val: lastResult.updated,      icon: RefreshCw,    color: "text-blue-600" },
              { label: "Out of Stock",  val: lastResult.out_of_stock, icon: AlertTriangle,color: "text-amber-600" },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
                <p className={`text-lg font-black ${s.color}`}>{s.val ?? "—"}</p>
                <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {lastResult?.error && (
          <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2 text-sm text-red-600">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {lastResult.error}
          </div>
        )}

        {lastResult?.synced_at && (
          <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last synced: {new Date(lastResult.synced_at).toLocaleString("en-PK")}
            {lastResult.duration_s && ` • ${lastResult.duration_s}s`}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminSync() {
  const [syncing,     setSyncing]     = useState({});       // { brandKey: bool }
  const [syncingAll,  setSyncingAll]  = useState(false);
  const [results,     setResults]     = useState({});       // { brandKey: resultObj }
  const [logs,        setLogs]        = useState([]);
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load last sync logs on mount
  useEffect(() => {
    fetch("https://khareedlo-backend-production.up.railway.app/api/sync/logs")
      .then(r => r.json())
      .then(rows => {
        if (!Array.isArray(rows)) return;
        const map = {};
        rows.forEach(r => {
          const key = BRANDS.find(b => b.label === r.brand_name)?.key;
          if (key) map[key] = r;
        });
        setResults(map);
        setLogs(rows.slice(0, 20));
      })
      .catch(() => {});
  }, []);

  const syncOne = async (brandKey) => {
    setSyncing(s => ({ ...s, [brandKey]: true }));
    try {
      const res  = await fetch(`https://khareedlo-backend-production.up.railway.app/api/sync/${brandKey}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setResults(r => ({ ...r, [brandKey]: data.result }));
      showToast(`${BRANDS.find(b=>b.key===brandKey)?.label} synced successfully! ${data.result.inserted} new, ${data.result.updated} updated.`);
    } catch (err) {
      setResults(r => ({ ...r, [brandKey]: { error: err.message } }));
      showToast(err.message, "error");
    } finally {
      setSyncing(s => ({ ...s, [brandKey]: false }));
    }
  };

  const syncAll = async () => {
    setSyncingAll(true);
    try {
      const res  = await fetch("https://khareedlo-backend-production.up.railway.app/api/sync/all", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");

      const newResults = {};
      data.results?.forEach(r => {
        const key = BRANDS.find(b => b.label === r.brand)?.key;
        if (key) newResults[key] = r;
      });
      setResults(r => ({ ...r, ...newResults }));
      showToast(`All brands synced! Check individual cards for details.`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSyncingAll(false);
    }
  };

  const anySync = syncingAll || Object.values(syncing).some(Boolean);

  return (
    <AdminLayout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-500" />
              Product Sync
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Fetch real-time products from brand websites (Shopify). Out-of-stock products auto-hidden.
            </p>
          </div>

          <button
            onClick={syncAll}
            disabled={anySync}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50 transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
          >
            <Zap className={`w-4 h-4 ${syncingAll ? "animate-spin" : ""}`} />
            {syncingAll ? "Syncing All…" : "Sync All Brands"}
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <strong>How it works:</strong> Clicking Sync fetches all products from the brand's Shopify store.
            New products are inserted, existing ones are updated (price, stock, image).
            Out-of-stock products are hidden from customers automatically.
            <span className="font-bold"> J. by Junaid Jamshed</span> is not Shopify — their products remain manually managed.
          </div>
        </div>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {BRANDS.map(brand => (
            <SyncCard
              key={brand.key}
              brand={brand}
              onSync={syncOne}
              syncing={syncingAll || syncing[brand.key]}
              lastResult={results[brand.key]}
            />
          ))}
        </div>

        {/* J. by Junaid Jamshed — manual note */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            <strong>J. by Junaid Jamshed</strong> uses a custom website (not Shopify) so automatic sync is not available.
            To update their products: go to <strong>Live Products</strong> and edit manually,
            or check <a href="https://www.junaidjamshed.com" target="_blank" rel="noreferrer"
              className="underline font-bold">junaidjamshed.com</a> and update buy_now_links for out-of-stock items.
          </div>
        </div>

        {/* Recent Sync Logs */}
        {logs.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-50">
              <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" /> Recent Sync History
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {logs.map((log, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {log.brand_name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{log.brand_name}</p>
                      <p className="text-[11px] text-gray-400">
                        {new Date(log.synced_at).toLocaleString("en-PK")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-emerald-600 font-bold">+{log.inserted} new</span>
                    <span className="text-blue-600 font-bold">↺ {log.updated} updated</span>
                    <span className="text-amber-600 font-bold">⚠ {log.out_of_stock} OOS</span>
                    <span className="text-gray-400">{log.duration_s}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold text-white max-w-sm ${
          toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
        }`}>
          {toast.type === "error"
            ? <XCircle className="w-4 h-4 flex-shrink-0" />
            : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}
    </AdminLayout>
  );
}