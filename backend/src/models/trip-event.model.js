const mongoose = require("mongoose");

const tripEventSchema = new mongoose.Schema(
  {
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true, index: true },
    actor: { type: String, required: true },
    eventType: { type: String, required: true },
    payload: { type: Object, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const TripEvent = mongoose.model("TripEvent", tripEventSchema);

module.exports = { TripEvent };
