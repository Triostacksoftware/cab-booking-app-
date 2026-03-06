const express = require("express");
const { asyncHandler } = require("../lib/async-handler");
const { ok } = require("../lib/http");
const { requireAuth } = require("../middleware/auth");
const { Ride } = require("../models/ride.model");
const { getTripHistory } = require("../services/ride.service");

function createTripsRouter() {
  const router = express.Router();

  router.use(requireAuth("customer"));

  router.get(
    "/history",
    asyncHandler(async (req, res) => {
      const result = await getTripHistory(req.auth.sub, {
        cursor: req.query.cursor,
        limit: req.query.limit,
      });
      ok(res, result);
    })
  );

  router.get(
    "/:tripId",
    asyncHandler(async (req, res) => {
      const trip = await Ride.findOne({
        _id: req.params.tripId,
        customerId: req.auth.sub,
      }).populate("driverId");
      ok(res, trip);
    })
  );

  return router;
}

module.exports = { createTripsRouter };
