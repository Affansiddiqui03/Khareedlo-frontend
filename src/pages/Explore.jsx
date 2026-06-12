// src/pages/Explore.jsx
// Static 4 brands (outlets.js) + dynamic new brands from DB API
// Selected outlet → map flies to it + shows large pulsing marker
// Distance filter fully functional when location active

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  MapContainer, TileLayer, Marker, Popup,
  useMap, useMapEvent, Circle,
} from "react-leaflet";
import L from "leaflet";
import staticOutlets from "../data/outlets";
import { haversineKm, fmtKm } from "../utils/geo";
import { useSearchParams, Link } from "react-router-dom";
import {
  MapPin, LocateFixed, Store, Clock,
  X, Search, Navigation,
} from "lucide-react";
import Footer from "../components/Footer";
import "leaflet/dist/leaflet.css";

const BASE = "https://khareedlo-backend-production.up.railway.app";

// ── Fix Leaflet default icon ──────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41],
});

const STATIC_BRAND_COLOR = {
  "J. by Junaid Jamshed": "#7C3A1E",
  "Zellbury":              "#1A4731",
  "Alkaram Studio":        "#5B1F7A",
  "Limelight":             "#B45309",
};

const PALETTE = [
  "#DC2626","#7C3AED","#0284C7","#059669",
  "#D97706","#DB2777","#0891B2","#65A30D",
];
const colorCache = {};
function brandColor(name) {
  if (STATIC_BRAND_COLOR[name]) return STATIC_BRAND_COLOR[name];
  if (colorCache[name])          return colorCache[name];
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  colorCache[name] = PALETTE[Math.abs(h) % PALETTE.length];
  return colorCache[name];
}

// Normal marker (small)
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

// Selected/highlighted marker (large + animated pulse ring)
function makeSelectedIcon(color) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 56">
      <path d="M20 0C8.954 0 0 8.954 0 20c0 15 20 36 20 36s20-21 20-36C40 8.954 31.046 0 20 0z" fill="${color}"/>
      <circle cx="20" cy="20" r="9" fill="white" opacity="0.98"/>
      <circle cx="20" cy="20" r="5" fill="${color}" opacity="0.8"/>
    </svg>
  `);
  return L.divIcon({
    html: `
      <div style="position:relative;width:50px;height:62px;">
        <div style="
          position:absolute;top:-10px;left:-10px;
          width:70px;height:70px;
          border-radius:50%;
          background:${color};
          opacity:0.25;
          animation:pulse-ring 1.4s ease-out infinite;
        "></div>
        <img src="data:image/svg+xml,${svg}" width="40" height="56" style="
          position:absolute;top:0;left:5px;
          filter:drop-shadow(0 4px 12px rgba(0,0,0,0.5));
        "/>
      </div>
      <style>
        @keyframes pulse-ring {
          0%   { transform: scale(0.6); opacity: 0.4; }
          70%  { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      </style>
    `,
    iconSize: [50, 62], iconAnchor: [25, 56], className: "",
  });
}

const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 5px rgba(59,130,246,0.25),0 2px 8px rgba(0,0,0,0.2)"></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8], className: "",
});

// FlyTo map when center changes
function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo([center.lat, center.lng], zoom || 15, { duration: 1.2, easeLinearity: 0.35 });
  // eslint-disable-next-line
  }, [center?.lat, center?.lng]);
  return null;
}

// Fly to user location (separate so it doesn't fire when outlet selected)
function FlyToUser({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo([center.lat, center.lng], zoom || 13, { duration: 1.4, easeLinearity: 0.35 });
  // eslint-disable-next-line
  }, [center?.lat, center?.lng]);
  return null;
}

function MapClickHandler({ enabled, onPick }) {
  useMapEvent("click", e => { if (enabled) onPick({ lat: e.latlng.lat, lng: e.latlng.lng }); });
  return null;
}

// Auto-open popup for selected marker
function SelectedPopupOpener({ selected, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (!selected) return;
    const marker = markerRefs.current[selected.id];
    if (marker) {
      setTimeout(() => marker.openPopup(), 400); // wait for flyTo
    }
  // eslint-disable-next-line
  }, [selected?.id]);
  return null;
}

const STATIC_BRAND_NAMES = new Set(["J. by Junaid Jamshed","Zellbury","Alkaram Studio","Limelight"]);

function normalizeApiOutlet(o) {
  return {
    id:         `api-${o.outlet_id}`,
    brandName:  o.brand_name,
    outletName: o.outlet_name,
    address:    o.address,
    city:       o.city,
    hours:      o.timing || "Hours not specified",
    phone:      o.phone  || null,
    coords:     { lat: parseFloat(o.latitude), lng: parseFloat(o.longitude) },
  };
}

export default function Explore() {
  const [searchParams] = useSearchParams();

  const [apiOutlets, setApiOutlets] = useState([]);
  const [brand,     setBrand]     = useState("all");
  const [city,      setCity]      = useState("all");
  const [radiusKm,  setRadiusKm]  = useState("any");
  const [query,     setQuery]     = useState(searchParams.get("q") || "");
  const [userLoc,    setUserLoc]    = useState(null);
  const [flyTarget,  setFlyTarget]  = useState(null); // for user location fly
  const [locLoading, setLocLoading] = useState(false);
  const [locError,   setLocError]   = useState("");
  const [pickMode,   setPickMode]   = useState(false);
  const [selected,   setSelected]   = useState(null);
  const [flyToOutlet, setFlyToOutlet] = useState(null); // for outlet fly

  // ref map of outlet id -> leaflet marker instance
  const markerRefs = useRef({});

  useEffect(() => {
    fetch(`${BASE}/api/outlets`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const newOnly = Array.isArray(data)
          ? data.filter(o => !STATIC_BRAND_NAMES.has(o.brand_name)).map(normalizeApiOutlet)
          : [];
        setApiOutlets(newOnly);
      })
      .catch(() => setApiOutlets([]));
  }, []);

  useEffect(() => {
    const b = searchParams.get("brand");
    const q = searchParams.get("q");
    if (b) setBrand(b);
    if (q) { setQuery(q); setBrand("all"); }
  }, [searchParams]);

  const allOutlets = useMemo(() => [...staticOutlets, ...apiOutlets], [apiOutlets]);
  const brands = useMemo(() => [...new Set(allOutlets.map(o => o.brandName))].sort(), [allOutlets]);
  const cities  = useMemo(() => [...new Set(allOutlets.map(o => o.city))].sort(),     [allOutlets]);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) { setLocError("Geolocation not supported."); return; }
    setLocLoading(true); setLocError("");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc);
        setFlyTarget(loc);
        setLocLoading(false);
      },
      ()  => { setLocError("Location access denied. Allow location in browser settings."); setLocLoading(false); },
      { timeout: 12000, enableHighAccuracy: true }
    );
  }, []);

  // When outlet is clicked from sidebar → fly map to it + show large marker
  const handleOutletClick = useCallback((o) => {
    const isAlreadySelected = selected?.id === o.id;
    if (isAlreadySelected) {
      setSelected(null);
      setFlyToOutlet(null);
    } else {
      setSelected(o);
      setFlyToOutlet({ lat: o.coords.lat, lng: o.coords.lng });
    }
  }, [selected]);

  const filteredOutlets = useMemo(() => {
    let data = [...allOutlets];
    if (brand !== "all") data = data.filter(o => o.brandName.toLowerCase() === brand.toLowerCase());
    if (city  !== "all") data = data.filter(o => o.city === city);
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(o =>
        o.outletName.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)    ||
        o.city.toLowerCase().includes(q)       ||
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
  }, [allOutlets, brand, city, radiusKm, userLoc, query]);

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
                Find stores near you • {allOutlets.length} outlets across Pakistan
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
                <input value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search outlet or area…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
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
              <select value={radiusKm} onChange={e => setRadiusKm(e.target.value)}
                disabled={!userLoc} title={!userLoc ? "Enable location first" : ""}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                <option value="any">Any Distance</option>
                <option value="2">Within 2 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
              </select>
              <button onClick={locateMe} disabled={locLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 transition-colors whitespace-nowrap shadow-sm">
                {locLoading
                  ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  : <LocateFixed className="w-4 h-4" />}
                {locLoading ? "Locating…" : "Use My Location"}
              </button>
              <button onClick={() => setPickMode(p => !p)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
                  pickMode ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
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
                <Navigation className="w-3.5 h-3.5"/> Click anywhere on the map to set your location
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
            {brands.map(b => {
              const c = brandColor(b);
              return (
                <button key={b} onClick={() => setBrand(b === brand ? "all" : b)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm"
                  style={{ background: brand === b ? c : "#E5E7EB", color: brand === b ? "white" : "#4B5563" }}>
                  {b}
                </button>
              );
            })}
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
                {/* Fly to user location when they click Use My Location */}
                <FlyToUser center={flyTarget} zoom={13} />
                {/* Fly to selected outlet */}
                {flyToOutlet && <FlyTo center={flyToOutlet} zoom={16} />}
                <MapClickHandler enabled={pickMode} onPick={loc => {
                  setUserLoc(loc);
                  setFlyTarget(loc);
                  setPickMode(false);
                }} />
                {/* Auto-open popup for selected */}
                <SelectedPopupOpener selected={selected} markerRefs={markerRefs} />

                {userLoc && (
                  <>
                    <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
                      <Popup><strong>📍 Your Location</strong></Popup>
                    </Marker>
                    {radiusKm !== "any" && (
                      <Circle center={[userLoc.lat, userLoc.lng]} radius={parseFloat(radiusKm) * 1000}
                        pathOptions={{ color: "#3B82F6", fillColor: "#3B82F6", fillOpacity: 0.07, weight: 1.5, dashArray: "5 5" }} />
                    )}
                  </>
                )}

                {filteredOutlets.map(o => {
                  const isSelected = selected?.id === o.id;
                  return (
                    <Marker
                      key={o.id}
                      position={[o.coords.lat, o.coords.lng]}
                      icon={isSelected ? makeSelectedIcon(brandColor(o.brandName)) : makeBrandIcon(brandColor(o.brandName))}
                      zIndexOffset={isSelected ? 1000 : 0}
                      ref={ref => { if (ref) markerRefs.current[o.id] = ref; }}
                      eventHandlers={{ click: () => handleOutletClick(o) }}
                    >
                      <Popup maxWidth={280}>
                        <div style={{ fontFamily: "Sora, sans-serif", padding: "4px 0" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                            <div style={{ width:10, height:10, borderRadius:"50%", background:brandColor(o.brandName), flexShrink:0 }}/>
                            <span style={{ fontSize:10, fontWeight:900, textTransform:"uppercase", letterSpacing:1, color:brandColor(o.brandName) }}>{o.brandName}</span>
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 800, marginBottom: 3, color:"#111" }}>{o.outletName}</p>
                          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 5 }}>{o.address}</p>
                          {o.distance !== undefined && (
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", marginBottom: 3 }}>📍 {fmtKm(o.distance)} away</p>
                          )}
                          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>🕐 {o.hours}</p>
                          {o.phone && <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>📞 {o.phone}</p>}
                          <a href={`https://www.google.com/maps/dir/?api=1&destination=${o.coords.lat},${o.coords.lng}`}
                            target="_blank" rel="noreferrer"
                            style={{ display:"inline-block", padding:"6px 12px", background:brandColor(o.brandName), color:"white", borderRadius:8, fontSize:12, fontWeight:700, textDecoration:"none" }}>
                            🗺 Get Directions
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
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
              {selected && (
                <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-md flex items-center gap-2 max-w-[240px]">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: brandColor(selected.brandName) }}/>
                  <span className="text-xs font-bold text-gray-800 truncate">{selected.outletName}</span>
                  <button onClick={() => { setSelected(null); setFlyToOutlet(null); }} className="ml-auto flex-shrink-0">
                    <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-700" />
                  </button>
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
                  <div key={o.id} onClick={() => handleOutletClick(o)}
                    className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                      selected?.id === o.id ? "ring-2 shadow-md" : "border-gray-100"
                    }`}
                    style={selected?.id === o.id ? { borderColor: brandColor(o.brandName), ringColor: brandColor(o.brandName) } : {}}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: brandColor(o.brandName) }} />
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: brandColor(o.brandName) }}>
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
                    {selected?.id === o.id && (
                      <p className="mt-2 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3"/> Shown on map ↑
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected outlet detail panel */}
          {selected && (
            <div className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="h-2" style={{ background: brandColor(selected.brandName) }} />
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl text-white font-extrabold text-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                      style={{ background: brandColor(selected.brandName) }}>
                      {selected.brandName[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: brandColor(selected.brandName) }}>
                        {selected.brandName}
                      </p>
                      <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{selected.outletName}</h3>
                      <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selected.address}</p>
                    </div>
                  </div>
                  <button onClick={() => { setSelected(null); setFlyToOutlet(null); }}
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
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.outletName + ' ' + selected.address)}`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-extrabold transition-all hover:shadow-lg hover:-translate-y-0.5"
                    style={{ background: brandColor(selected.brandName) }}>
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