// ── Haversine straight-line distance (fallback only) ──────────
export function haversineKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1  = toRad(a.lat);
  const lat2  = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const x = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// ── OSRM road distance for a batch of outlets ─────────────────
// userLoc: { lat, lng }
// outlets: array of { id, coords: { lat, lng }, ...rest }
// Returns: Map of outlet id → road distance in km
export async function fetchRoadDistances(userLoc, outlets) {
  if (!outlets.length) return new Map();

  // OSRM table endpoint: user location as source, all outlets as destinations
  // Format: lng,lat;lng,lat;...
  const coordStr = [
    `${userLoc.lng},${userLoc.lat}`,
    ...outlets.map(o => `${o.coords.lng},${o.coords.lat}`)
  ].join(";");

  // sources=0 means only calculate distances FROM index 0 (user) TO all others
  const url = `https://router.project-osrm.org/table/v1/driving/${coordStr}?sources=0&annotations=distance`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error("OSRM error");
    const data = await res.json();

    if (data.code !== "Ok" || !data.distances?.[0]) throw new Error("Bad response");

    // distances[0] = array of distances in meters from user to each point
    // index 0 = user→user (0), index 1..n = user→outlet[0..n-1]
    const distMap = new Map();
    outlets.forEach((o, i) => {
      const meters = data.distances[0][i + 1];
      if (meters != null && meters >= 0) {
        distMap.set(o.id, meters / 1000); // convert to km
      }
    });
    return distMap;
  } catch {
    // OSRM failed → fall back to Haversine for all outlets
    const distMap = new Map();
    outlets.forEach(o => distMap.set(o.id, haversineKm(userLoc, o.coords)));
    return distMap;
  }
}

// ── Smart distance formatter ───────────────────────────────────
export function fmtKm(km) {
  const m = km * 1000;
  if (m < 1000) return `${Math.round(m)} m`;
  if (km < 10)  return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

function toRad(d) {
  return (d * Math.PI) / 180;
}