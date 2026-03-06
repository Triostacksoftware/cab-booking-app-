const test = require("node:test");
const assert = require("node:assert/strict");
const { buildEstimate } = require("../src/services/ride.service");

test("buildEstimate returns fare and eta for shared ride", () => {
  const result = buildEstimate({
    pickup: { lat: 28.6139, lng: 77.209 },
    drop: { lat: 28.5562, lng: 77.1 },
    rideType: "shared",
    passengerCount: 1,
  });

  assert.equal(result.rideType, "shared");
  assert.ok(result.fareEstimate >= 30);
  assert.ok(result.etaMinutes >= 5);
});

test("buildEstimate rejects capacity overflow", () => {
  assert.throws(() =>
    buildEstimate({
      pickup: { lat: 28.6139, lng: 77.209 },
      drop: { lat: 28.5562, lng: 77.1 },
      rideType: "shared",
      passengerCount: 4,
    })
  );
});
