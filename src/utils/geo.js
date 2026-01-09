export function haversineKm(a, b) {
const R = 6371; // km
const dLat = toRad(b.lat - a.lat);
const dLng = toRad(b.lng - a.lng);
const lat1 = toRad(a.lat);
const lat2 = toRad(b.lat);


const sinDLat = Math.sin(dLat / 2);
const sinDLng = Math.sin(dLng / 2);


const x = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
return R * y;
}


export function fmtKm(km) {
if (km < 1) return `${Math.round(km * 1000)} m`;
return `${km.toFixed(1)} km`;
}


function toRad(d) {
return (d * Math.PI) / 180;
}