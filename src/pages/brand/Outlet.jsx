// Brand dashboard page to manage outlet locations
// Route: /brand/outlets

import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  MapPin, Plus, Trash2, MapContainer as MapIcon,
  Phone, Clock, Building2, AlertTriangle,
  CheckCircle, XCircle, Loader2, Navigation,
} from "lucide-react";
import {
  MapContainer, TileLayer, Marker, useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const BASE = "https://khareedlo-backend-production.up.railway.app";

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41],
});

// Map click handler to pick lat/lng
function MapPicker({ onPick }) {
  useMapEvents({
    click(e) { onPick(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

const EMPTY_FORM = {
  outlet_name: "",
  address:     "",
  city:        "",
  latitude:    "",
  longitude:   "",
  phone:       "",
  timing:      "",
};

const PAKISTAN_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
  "Hyderabad", "Abbottabad", "Bahawalpur", "Sargodha", "Sukkur",
];

export default function BrandOutlets() {
  const outlet    = useOutletContext() || {};
  const theme     = outlet.theme    || { accent: "#DC2626", accentLight: "#EA580C" };
  const brandId   = outlet.brandId;

  const [outlets,  setOutlets]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast,    setToast]    = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [pickMode, setPickMode] = useState(false);
  const [mapPos,   setMapPos]   = useState([30.3753, 69.3451]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch brand's outlets ─────────────────────────────────
  const fetchOutlets = useCallback(async () => {
    if (!brandId) return;
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/outlets/brand/${brandId}`);
      const data = res.ok ? await res.json() : [];
      setOutlets(Array.isArray(data) ? data : []);
    } catch {
      setOutlets([]);
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => { fetchOutlets(); }, [fetchOutlets]);

  // ── Form validation ───────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.outlet_name.trim()) e.outlet_name = "Outlet name required";
    if (!form.address.trim())     e.address     = "Address required";
    if (!form.city.trim())        e.city        = "City required";
    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    if (isNaN(lat) || lat < -90  || lat > 90)  e.latitude  = "Valid latitude required (–90 to 90)";
    if (isNaN(lng) || lng < -180 || lng > 180) e.longitude = "Valid longitude required (–180 to 180)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Map pick handler ──────────────────────────────────────
  const handleMapPick = (lat, lng) => {
    setForm(f => ({ ...f, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
    setMapPos([lat, lng]);
    setPickMode(false);
    setErrors(e => ({ ...e, latitude: undefined, longitude: undefined }));
  };

  // ── Use browser geolocation to pre-fill ──────────────────
  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      handleMapPick(pos.coords.latitude, pos.coords.longitude);
    });
  };

  // ── Submit add outlet ─────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res  = await fetch(`${BASE}/api/outlets/add`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, brand_id: brandId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      showToast("Outlet added successfully!");
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchOutlets();
    } catch (err) {
      showToast(err.message || "Failed to add outlet", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete outlet ─────────────────────────────────────────
  const handleDelete = async (outletId) => {
    setDeleting(outletId);
    try {
      const res  = await fetch(`${BASE}/api/outlets/${outletId}`, {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_id: brandId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setOutlets(prev => prev.filter(o => o.outlet_id !== outletId));
      showToast("Outlet removed.");
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleInput = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold max-w-xs ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error"
            ? <XCircle className="w-4 h-4 flex-shrink-0" />
            : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Outlets</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your physical store locations shown on the Explore map.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(f => !f); setForm(EMPTY_FORM); setErrors({}); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm hover:opacity-90 transition"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Outlet"}
        </button>
      </div>

      {/* ── Add Outlet Form ───────────────────────────────── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Form header strip */}
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentLight})` }} />
          <div className="p-5 sm:p-6 space-y-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: theme.accent }} />
              New Outlet Details
            </h2>

            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Outlet Name *
                </label>
                <input
                  value={form.outlet_name}
                  onChange={e => handleInput("outlet_name", e.target.value)}
                  placeholder="e.g. Packages Mall Lahore"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.outlet_name ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
                  }`}
                />
                {errors.outlet_name && <p className="text-red-500 text-xs mt-1">{errors.outlet_name}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  City *
                </label>
                <select
                  value={form.city}
                  onChange={e => handleInput("city", e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white ${
                    errors.city ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
                  }`}
                >
                  <option value="">Select city…</option>
                  {PAKISTAN_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Full Address *
              </label>
              <input
                value={form.address}
                onChange={e => handleInput("address", e.target.value)}
                placeholder="e.g. Shop 12, Ground Floor, Packages Mall, Walton Road, Lahore"
                className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.address ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
                }`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Lat / Lng */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Location Coordinates *
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={useMyLocation}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" /> Use My GPS
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => setPickMode(p => !p)}
                    className={`text-xs font-semibold flex items-center gap-1 ${
                      pickMode ? "text-red-600" : "text-blue-600 hover:text-blue-700"
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    {pickMode ? "Cancel Pick" : "Pick on Map"}
                  </button>
                </div>
              </div>

              {/* Map picker */}
              <div className="rounded-xl overflow-hidden border border-gray-200 mb-3" style={{ height: 240 }}>
                <MapContainer center={mapPos} zoom={5} className="w-full h-full" style={{ zIndex: 0 }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© OpenStreetMap'
                  />
                  <MapPicker onPick={handleMapPick} />
                  {form.latitude && form.longitude && (
                    <Marker position={[parseFloat(form.latitude), parseFloat(form.longitude)]} />
                  )}
                </MapContainer>
              </div>

              {pickMode && (
                <p className="text-xs text-blue-600 font-semibold flex items-center gap-1 mb-2 animate-pulse">
                  <MapPin className="w-3 h-3" /> Click anywhere on the map to set coordinates
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    value={form.latitude}
                    onChange={e => handleInput("latitude", e.target.value)}
                    placeholder="Latitude e.g. 31.5204"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 ${
                      errors.latitude ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
                    }`}
                  />
                  {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                </div>
                <div>
                  <input
                    value={form.longitude}
                    onChange={e => handleInput("longitude", e.target.value)}
                    placeholder="Longitude e.g. 74.3587"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 ${
                      errors.longitude ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
                    }`}
                  />
                  {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-1.5">
                💡 Tip: Search your location on <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="underline text-blue-500">Google Maps</a>, right-click → "What's here?" to get exact coordinates.
              </p>
            </div>

            {/* Phone + Timing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Phone Number
                </label>
                <input
                  value={form.phone}
                  onChange={e => handleInput("phone", e.target.value)}
                  placeholder="e.g. 042-111-786-786"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Store Timing
                </label>
                <input
                  value={form.timing}
                  onChange={e => handleInput("timing", e.target.value)}
                  placeholder="e.g. 10 AM – 10 PM"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 shadow-sm hover:opacity-90 transition"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}
              >
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  : <><Plus className="w-4 h-4" /> Add Outlet</>}
              </button>
              <button
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setErrors({}); }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Outlet List ───────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100" />)}
        </div>
      ) : outlets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <Building2 className="w-7 h-7 text-gray-300" />
          </div>
          <p className="font-bold text-gray-700">No outlets added yet</p>
          <p className="text-gray-400 text-sm mt-1">Add your first physical store location above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outlets.map(o => (
            <div key={o.outlet_id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Color strip */}
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentLight})` }} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{o.outlet_name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" /> {o.address}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(o.outlet_id)}
                    disabled={deleting === o.outlet_id}
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 disabled:opacity-50 flex-shrink-0 transition"
                  >
                    {deleting === o.outlet_id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">City</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{o.city}</p>
                  </div>
                  {o.timing && (
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Hours</p>
                      <p className="text-xs font-bold text-gray-800 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" /> {o.timing}
                      </p>
                    </div>
                  )}
                  {o.phone && (
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Phone</p>
                      <p className="text-xs font-bold text-gray-800 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 flex-shrink-0" /> {o.phone}
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Coordinates</p>
                    <p className="text-[10px] font-mono text-gray-600 mt-0.5">
                      {parseFloat(o.latitude).toFixed(4)}, {parseFloat(o.longitude).toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Google Maps link */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${o.latitude},${o.longitude}`}
                  target="_blank" rel="noreferrer"
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <MapPin className="w-3 h-3" /> View on Google Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Your outlets appear on the public Explore map</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Once added, customers can find your outlet on the Khareedlo Explore page and get directions. Make sure your coordinates are accurate.
          </p>
        </div>
      </div>
    </div>
  );
}