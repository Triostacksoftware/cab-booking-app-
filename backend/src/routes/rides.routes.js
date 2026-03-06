const express = require("express");
const { asyncHandler } = require("../lib/async-handler");
const { ok } = require("../lib/http");
const { requireAuth } = require("../middleware/auth");
const { Ride } = require("../models/ride.model");
const {
  buildEstimate,
  cancelRide,
  createRide,
  getActiveRideForCustomer,
} = require("../services/ride.service");
const { scheduleRideDispatch } = require("../services/dispatch.service");

function createRidesRouter({ logger }) {
  const router = express.Router();

  router.use(requireAuth("customer"));

  router.post(
    "/estimate",
    asyncHandler(async (req, res) => {
      const estimate = buildEstimate({
        pickup: req.body.pickup.coordinates,
        drop: req.body.drop.coordinates,
        rideType: req.body.rideType,
        passengerCount: req.body.passengerCount,
      });
      ok(res, estimate);
    })
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const { ride, rideOtp } = await createRide({
        customerId: req.auth.sub,
        payload: req.body,
      });

      scheduleRideDispatch(ride._id, logger);

      ok(
        res,
        {
          rideId: ride._id,
          status: ride.status,
          statusVersion: ride.statusVersion,
          developmentOtpPreview: rideOtp,
        },
        201
      );
    })
  );

  router.get(
    "/active/current",
    asyncHandler(async (req, res) => {
      const ride = await getActiveRideForCustomer(req.auth.sub);
      ok(res, ride);
    })
  );

  router.get(
    "/:rideId",
    asyncHandler(async (req, res) => {
      const ride = await Ride.findOne({
        _id: req.params.rideId,
        customerId: req.auth.sub,
      }).populate("driverId");
      ok(res, ride);
    })
  );

  router.post(
    "/:rideId/cancel",
    asyncHandler(async (req, res) => {
      const ride = await cancelRide({
        rideId: req.params.rideId,
        actor: "customer",
        reason: req.body.reason,
      });
      ok(res, ride);
    })
  );

  return router;
}

module.exports = { createRidesRouter };
