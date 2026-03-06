function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceInKm(start, end) {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(end.lat - start.lat);
  const lngDelta = toRadians(end.lng - start.lng);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRadians(start.lat)) *
      Math.cos(toRadians(end.lat)) *
      Math.sin(lngDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function ensureCoordinates(value, label) {
  if (
    !value ||
    typeof value.lat !== "number" ||
    typeof value.lng !== "number" ||
    !Number.isFinite(value.lat) ||
    !Number.isFinite(value.lng) ||
    value.lat < -90 ||
    value.lat > 90 ||
    value.lng < -180 ||
    value.lng > 180
  ) {
    throw new Error(`Invalid coordinates for ${label}`);
  }
}

module.exports = {
  distanceInKm,
  ensureCoordinates,
};
