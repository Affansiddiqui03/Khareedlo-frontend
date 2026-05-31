// src/pages/Explore.jsx
// UPDATED: Footer added at bottom
// All map/outlet/location functionality preserved

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  MapContainer, TileLayer, Marker, Popup,
  useMap, useMapEvent, Circle,
} from "react-leaflet";
import L from "leaflet";
import outlets from "../data/outlets";
import { haversineKm, fmtKm } from "../utils/geo";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  MapPin, LocateFixed, Store, Clock,
  Phone, X, Search, Navigation,
} from "lucide-react";
import Footer from "../components/Footer";
import "leaflet/dist/leaflet.css";

// ── Fix Leaflet default icon ──────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:  [25, 41], iconAnchor: [12, 41],
});

const BRAND_COLOR = {
  "J. by Junaid Jamshed": "#7C3A1E",
  "Zellbury":              "#1A4731",
  "Alkaram Studio":        "#5B1F7A",
  "Limelight":             "#B45309",
};

function makeBrandIcon(color) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44">
      <path d="M16 0C7.164 0 0 7.163 0 16c0 12 16 28 16 28s16-16 16-28C32 7.163 24.836 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="7" fill="white" opacity="0.95"/>
    </svg>
  `);
  return L.divIcon({
    html: `<img src="data:image/svg+xml,${svg}" width="28" height="38" style="filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35))"/>`,
    iconSize: [28, 38], iconAnchor: [14, 38], className: "",
  });
}

const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 5px rgba(59,130,246,0.25),0 2px 8px rgba(0,0,0,0.2)"></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8], className: "",
});

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo([center.lat, center.lng], zoom || 13, { duration: 1.4, easeLinearity: 0.35 });
  }, [center]);
  return null;
}

function MapClickHandler({ enabled, onPick }) {
  useMapEvent("click", e => { if (enabled) onPick({ lat: e.latlng.lat, lng: e.latlng.lng }); });
  return null;
}

export default function Explore() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [userLoc,    setUserLoc]    = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError,   setLocError]   = useState("");
  const [pickMode,   setPickMode]   = useState(false);
  const [brand,      setBrand]      = useState(searchParams.get("brand") || "all");
  const [city,       setCity]       = useState("all");
  const [radiusKm,   setRadiusKm]   = useState("any");
  const [query,      setQuery]      = useState("");
  const [selected,   setSelected]   = useState(null);

  useEffect(() => {
    const b = searchParams.get("brand");
    if (b) setBrand(b);
  }, [searchParams]);

  const brands = useMemo(() => [...new Set(outlets.map(o => o.brandName))], []);
  const cities  = useMemo(() => [...new Set(outlets.map(o => o.city))].sort(), []);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) { setLocError("Geolocation not supported by your browser."); return; }
    setLocLoading(true); setLocError("");
    navigator.geolocation.getCurrentPosition(
      pos => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocLoading(false); },
      () => { setLocError("Location access denied. Please allow location in browser settings."); setLocLoading(false); },
      { timeout: 12000, enableHighAccuracy: true }
    );
  }, []);

  const filteredOutlets = useMemo(() => {
    let data = [...outlets];
    if (brand !== "all") data = data.filter(o => o.brandName === brand);
    if (city  !== "all") data = data.filter(o => o.city === city);
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(o =>
        o.outletName.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.brandName.toLowerCase().includes(q)
      );
    }
    if (userLoc && radiusKm !== "any") {
      const r = parseFloat(radiusKm);
      data = data
        .map(o => ({ ...o, distance: haversineKm(userLoc, o.coords) }))
        .filter(o => o.distance <= r)
        .sort((a, b) => a.distance - b.distance);
    } else if (userLoc) {
      data = data
        .map(o => ({ ...o, distance: haversineKm(userLoc, o.coords) }))
        .sort((a, b) => a.distance - b.distance);
    }
    return data;
  }, [brand, city, radiusKm, userLoc, query]);

  const mapCenter = userLoc
    ? [userLoc.lat, userLoc.lng]
    : filteredOutlets.length
    ? [filteredOutlets[0].coords.lat, filteredOutlets[0].coords.lng]
    : [30.3753, 69.3451];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#fff9f7] to-[#ffb48f]" style={{ fontFamily: "'Sora','DM Sans',sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-5" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">Explore Brand Outlets</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Find stores near you • {outlets.length} outlets across Pakistan
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search outlet or area…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>
              <select value={brand} onChange={e => setBrand(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer">
                <option value="all">All Brands</option>
                {brands.map(b => <option key={b}>{b}</option>)}
              </select>
              <select value={city} onChange={e => setCity(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer">
                <option value="all">All Cities</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
              <select
                value={radiusKm}
                onChange={e => setRadiusKm(e.target.value)}
                disabled={!userLoc}
                title={!userLoc ? "Enable location first" : ""}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="any">Any Distance</option>
                <option value="2">Within 2 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
              </select>
              <button
                onClick={locateMe}
                disabled={locLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 transition-colors whitespace-nowrap shadow-sm"
              >
                {locLoading
                  ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  : <LocateFixed className="w-4 h-4" />
                }
                {locLoading ? "Locating…" : "Use My Location"}
              </button>
              <button
                onClick={() => setPickMode(p => !p)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
                  pickMode ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Navigation className="w-4 h-4" />
                {pickMode ? "Cancel Pick" : "Pick on Map"}
              </button>
            </div>
            {locError && <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5"><X className="w-3.5 h-3.5"/>{locError}</p>}
            {userLoc && !locError && (
              <p className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Location active — outlets sorted by distance from you
                {radiusKm !== "any" && ` (within ${radiusKm} km)`}
              </p>
            )}
            {pickMode && (
              <p className="mt-2 text-xs text-blue-600 font-semibold flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5"/>
                Click anywhere on the map to set your location
              </p>
            )}
          </div>

          {/* Brand quick filters */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            <button onClick={() => setBrand("all")}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                brand === "all" ? "bg-gray-900 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}>
              All Brands
            </button>
            {brands.map(b => (
              <button key={b} onClick={() => setBrand(b === brand ? "all" : b)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap text-white shadow-sm"
                style={{
                  background: brand === b ? BRAND_COLOR[b] || "#DC2626" : "#E5E7EB",
                  color: brand === b ? "white" : "#4B5563",
                }}>
                {b}
              </button>
            ))}
          </div>

          {/* Map + List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Map */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-200 shadow-lg"
              style={{ height: "70vh", minHeight: 420, position: "relative", zIndex: 0 }}>
              <MapContainer center={mapCenter} zoom={userLoc ? 12 : 6} className="w-full h-full" style={{ zIndex: 0 }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <FlyTo center={userLoc} zoom={12} />
                <MapClickHandler enabled={pickMode} onPick={loc => { setUserLoc(loc); setPickMode(false); }} />

                {userLoc && (
                  <>
                    <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
                      <Popup><strong>📍 Your Location</strong></Popup>
                    </Marker>
                    {radiusKm !== "any" && (
                      <Circle center={[userLoc.lat, userLoc.lng]} radius={parseFloat(radiusKm)*1000}
                        pathOptions={{ color: "#3B82F6", fillColor: "#3B82F6", fillOpacity: 0.07, weight: 1.5, dashArray: "5 5" }}
                      />
                    )}
                  </>
                )}

                {filteredOutlets.map(o => (
                  <Marker key={o.id} position={[o.coords.lat, o.coords.lng]}
                    icon={makeBrandIcon(BRAND_COLOR[o.brandName] || "#DC2626")}
                    eventHandlers={{ click: () => setSelected(o) }}>
                    <Popup maxWidth={260}>
                      <div style={{ fontFamily: "Sora, sans-serif", padding: "2px 0" }}>
                        <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }}>{o.outletName}</p>
                        <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{o.address}</p>
                        {o.distance !== undefined && (
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", marginBottom: 2 }}>📍 {fmtKm(o.distance)} away</p>
                        )}
                        <p style={{ fontSize: 11, color: "#6B7280" }}>🕐 {o.hours}</p>
                        {o.phone && <p style={{ fontSize: 11, color: "#6B7280" }}>📞 {o.phone}</p>}
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${o.coords.lat},${o.coords.lng}`}
                          target="_blank" rel="noreferrer"
                          style={{ display: "inline-block", marginTop: 8, fontSize: 11, fontWeight: 700, color: "#DC2626" }}>
                          Get Directions →
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-md">
                <span className="text-xs font-extrabold text-gray-700">
                  {filteredOutlets.length} outlet{filteredOutlets.length !== 1 ? "s" : ""} shown
                </span>
              </div>

              {pickMode && (
                <div className="absolute top-3 right-3 z-[400] bg-blue-600 text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-md animate-pulse">
                  Click map to set location
                </div>
              )}
            </div>

            {/* Outlet List */}
            <div className="flex flex-col" style={{ height: "70vh", minHeight: 420 }}>
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h3 className="text-base font-extrabold text-gray-900">
                  {filteredOutlets.length} Result{filteredOutlets.length !== 1 ? "s" : ""}
                </h3>
                {(brand !== "all" || city !== "all" || query) && (
                  <button onClick={() => { setBrand("all"); setCity("all"); setQuery(""); setRadiusKm("any"); }}
                    className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-0.5" style={{ scrollbarWidth: "thin" }}>
                {filteredOutlets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
                    <MapPin className="w-10 h-10 text-gray-200 mb-3" />
                    <p className="font-bold text-gray-500 text-sm">No outlets match your filters</p>
                    <p className="text-gray-400 text-xs mt-1">Try changing brand, city, or radius</p>
                  </div>
                ) : filteredOutlets.map(o => (
                  <div key={o.id} onClick={() => setSelected(o === selected ? null : o)}
                    className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                      selected?.id === o.id ? "ring-2 shadow-md" : "border-gray-100"
                    }`}
                    style={selected?.id === o.id ? { borderColor: BRAND_COLOR[o.brandName] || "#DC2626" } : {}}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: BRAND_COLOR[o.brandName] || "#DC2626" }} />
                        <span className="text-[10px] font-black uppercase tracking-widest"
                          style={{ color: BRAND_COLOR[o.brandName] || "#DC2626" }}>
                          {o.brandName}
                        </span>
                      </div>
                      {o.distance !== undefined && (
                        <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">
                          {fmtKm(o.distance)}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug">{o.outletName}</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-[11px] text-gray-500 flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" /> {o.address}</p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1.5"><Clock className="w-3 h-3 flex-shrink-0" /> {o.hours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected outlet detail */}
          {selected && (
            <div className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="h-2" style={{ background: BRAND_COLOR[selected.brandName] || "#DC2626" }} />
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl text-white font-extrabold text-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                      style={{ background: BRAND_COLOR[selected.brandName] || "#DC2626" }}>
                      {selected.brandName[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: BRAND_COLOR[selected.brandName] || "#DC2626" }}>
                        {selected.brandName}
                      </p>
                      <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{selected.outletName}</h3>
                      <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selected.address}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-2xl p-3.5">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Hours</p>
                    <p className="text-sm font-bold text-gray-800">{selected.hours}</p>
                  </div>
                  {selected.phone && (
                    <div className="bg-gray-50 rounded-2xl p-3.5">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Phone</p>
                      <a href={`tel:${selected.phone}`} className="text-sm font-bold text-gray-800 hover:text-blue-600">{selected.phone}</a>
                    </div>
                  )}
                  {selected.distance !== undefined && (
                    <div className="bg-blue-50 rounded-2xl p-3.5">
                      <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mb-1">Distance</p>
                      <p className="text-sm font-extrabold text-blue-700">{fmtKm(selected.distance)} away</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selected.coords.lat},${selected.coords.lng}`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-extrabold transition-all hover:shadow-lg hover:-translate-y-0.5"
                    style={{ background: BRAND_COLOR[selected.brandName] || "linear-gradient(135deg,#DC2626,#EA580C)" }}>
                    <Navigation className="w-4 h-4" /> Get Directions on Google Maps
                  </a>
                  <Link to="/brands"
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50">
                    <Store className="w-4 h-4" /> View Brand Products
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}