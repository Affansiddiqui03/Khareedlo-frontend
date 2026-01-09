// src/pages/Explore.jsx
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import L from "leaflet";
import outlets from "../data/outlets";
import { haversineKm, fmtKm } from "../utils/geo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, LocateFixed, MousePointerClick, Filter } from "lucide-react";
import "leaflet/dist/leaflet.css";

// 🔧 Fix Leaflet default marker
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// 🔧 Fly to user location
function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo([center.lat, center.lng], 12, { duration: 0.7 });
  }, [center, map]);
  return null;
}



// 🔧 Click to pick location
function ClickToSet({ onPick, enabled }) {
  useMapEvent("click", (e) => {
    if (!enabled) return;
    onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  return null;
}

export default function Explore() {
  const navigate = useNavigate();
  const [userLoc, setUserLoc] = useState(null);
  const [searchParams] = useSearchParams();
const brandFromQuery = searchParams.get("brand");

const [brand, setBrand] = useState(brandFromQuery || "all");
  const [city, setCity] = useState("all");
  const [radiusKm, setRadiusKm] = useState("any");
  const [pickOnMap, setPickOnMap] = useState(false);

    useEffect(() => {
    if (brandFromQuery) {
      setBrand(brandFromQuery);
    }
  }, [brandFromQuery]);
  const brands = useMemo(() => [...new Set(outlets.map(o => o.brandName))], []);
  const cities = useMemo(() => [...new Set(outlets.map(o => o.city))], []);

  const filteredOutlets = useMemo(() => {
    let data = [...outlets];

    if (brand !== "all") data = data.filter(o => o.brandName === brand);
    if (city !== "all") data = data.filter(o => o.city === city);

    if (userLoc && radiusKm !== "any") {
      const r = parseFloat(radiusKm);
      data = data
        .map(o => ({
          ...o,
          distance: haversineKm(userLoc.lat, userLoc.lng, o.coords.lat, o.coords.lng)
        }))
        .filter(o => o.distance <= r)
        .sort((a, b) => a.distance - b.distance);
    }

    return data;
  }, [brand, city, radiusKm, userLoc]);

  const mapCenter =
    userLoc
      ? [userLoc.lat, userLoc.lng]
      : filteredOutlets.length
      ? [filteredOutlets[0].coords.lat, filteredOutlets[0].coords.lng]
      : [30.3753, 69.3451];

  return (
    <div className="relative z-0 p-4 md:p-6 bg-gradient-to-b from-[#ffd3a3] to-[#ffb48f] min-h-screen">

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <MapPin className="w-6 h-6 text-indigo-600" />
        Explore Outlets
      </h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 lg:sticky lg:top-20 z-10">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-700">
          <Filter className="w-5 h-5" /> Filters & Location
        </h3>

        <div className="flex flex-wrap gap-3 mb-4">
          <select value={brand} onChange={e => setBrand(e.target.value)} className="p-2 border rounded-lg">
            <option value="all">All Brands</option>
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>

          <select value={city} onChange={e => setCity(e.target.value)} className="p-2 border rounded-lg">
            <option value="all">All Cities</option>
            {cities.map(c => <option key={c}>{c}</option>)}
          </select>

          <select value={radiusKm} onChange={e => setRadiusKm(e.target.value)} disabled={!userLoc} className="p-2 border rounded-lg">
            <option value="any">Radius</option>
            <option value="2">2 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigator.geolocation.getCurrentPosition(
            pos => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          )} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-indigo-100 text-indigo-700">
            <LocateFixed className="w-4 h-4" /> Use My Location
          </button>

          <button onClick={() => setPickOnMap(p => !p)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
              pickOnMap ? "bg-red-500 text-white" : "bg-gray-100"
            }`}>
            <MousePointerClick className="w-4 h-4" />
            {pickOnMap ? "Cancel Picking" : "Pick on Map"}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Map */}
        <div className="lg:col-span-2 h-[60vh] min-h-[400px] rounded-xl overflow-hidden border relative z-0">
          <MapContainer center={mapCenter} zoom={6} className="w-full h-full leaflet-z-fix">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FlyTo center={userLoc} />
            <ClickToSet enabled={pickOnMap} onPick={setUserLoc} />

            {userLoc && (
              <Marker position={[userLoc.lat, userLoc.lng]}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {filteredOutlets.map(o => (
              <Marker key={o.id} position={[o.coords.lat, o.coords.lng]}>
                <Popup>
                  <strong>{o.outletName}</strong>
                  <p>{o.address}</p>
                  {o.distance && <p>{fmtKm(o.distance)} away</p>}
                  <button onClick={() => navigate(`/outlet/${o.id}`)} className="text-indigo-600 text-sm">
                    View Details
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* List */}
        <div className="h-[60vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-3">{filteredOutlets.length} Results</h3>
          <div className="space-y-4">
            {filteredOutlets.map(o => (
              <div key={o.id} onClick={() => navigate(`/outlet/${o.id}`)}
                className="bg-white p-4 rounded-xl shadow cursor-pointer">
                <h4 className="font-bold">{o.outletName}</h4>
                <p className="text-sm">{o.address}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
