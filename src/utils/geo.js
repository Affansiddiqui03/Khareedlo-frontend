// ── Haversine distance between two {lat, lng} points ──────────
export function haversineKm(a, b) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1  = toRad(a.lat);
  const lat2  = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const x = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

// ── Smart distance formatter ───────────────────────────────────
// < 100 m  → "50 m"
// 100–999m → "350 m"
// 1–9.9 km → "2.4 km"
// ≥ 10 km  → "14 km"
export function fmtKm(km) {
  const m = km * 1000;
  if (m < 1000) return `${Math.round(m)} m`;
  if (km < 10)  return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

function toRad(d) {
  return (d * Math.PI) / 180;
}