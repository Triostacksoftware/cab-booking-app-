const express = require("express");
const { asyncHandler } = require("../lib/async-handler");
const { ok } = require("../lib/http");
const { AppError } = require("../lib/errors");
const { Driver } = require("../models/driver.model");
const { Ride } = require("../models/ride.model");
const { DRIVER_STATUS, RIDE_STATUS, SOCKET_EVENT, TRIP_EVENT } = require("../config/constants");
const { emitRideLifecycle } = require("../services/socket.service");
const { scheduleRideDispatch } = require("../services/dispatch.service");
const { recordTripEvent } = require("../services/ride.service");

function createDispatchRouter({ logger }) {
  const router = express.Router();

  router.post(
    "/:rideId/accept",
    asyncHandler(async (req, res) => {
      const { driverId } = req.body;
      const ride = await Ride.findById(req.params.rideId);
      if (!ride) throw new AppError("Ride not found", 404);
      if (ride.status !== RIDE_STATUS.SEARCHING_DRIVER) {
        throw new AppError("Ride is not available for acceptance", 409);
      }

      const driver = await Driver.findById(driverId);
      if (!driver) throw new AppError("Driver not found", 404);

      ride.driverId = driver._id;
      ride.assignedAt = new Date();
      ride.status = RIDE_STATUS.DRIVER_ASSIGNED;
      ride.statusVersion += 1;
      ride.statusTimeline.push({
        status: RIDE_STATUS.DRIVER_ASSIGNED,
        actor: "dispatch",
        metadata: { driverId: String(driver._id) },
        at: new Date(),
      });
      await ride.save();

      driver.currentStatus = DRIVER_STATUS.BUSY;
      await driver.save();

      await recordTripEvent(ride._id, "dispatch", TRIP_EVENT.DRIVER_ASSIGNED, {
        driverId: String(driver._id),
      });

      emitRideLifecycle(ride, SOCKET_EVENT.DRIVER_ASSIGNED, {
        driver: {
          id: String(driver._id),
          name: driver.fullName,
          mobileNumber: driver.mobile,
          rating: driver.rating,
          vehicle: {
            number: driver.vehicleNumber,
            capacity: driver.vehicleCapacity,
          },
        },
      });

      ok(res, ride);
    })
  );

  router.post(
    "/:rideId/reject",
    asyncHandler(async (req, res) => {
      const { driverId } = req.body;
      const ride = await Ride.findById(req.params.rideId);
      if (!ride) throw new AppError("Ride not found", 404);

      if (driverId) {
        await Driver.findByIdAndUpdate(driverId, { $set: { currentStatus: DRIVER_STATUS.ONLINE } });
      }

      if (ride.status === RIDE_STATUS.DRIVER_ASSIGNED && String(ride.driverId) === String(driverId)) {
        ride.driverId = null;
        ride.assignedAt = null;
        ride.status = RIDE_STATUS.SEARCHING_DRIVER;
        ride.statusVersion += 1;
        ride.statusTimeline.push({
          status: RIDE_STATUS.SEARCHING_DRIVER,
          actor: "dispatch",
          metadata: { reason: "driver_rejected" },
          at: new Date(),
        });
        await ride.save();
      }

      scheduleRideDispatch(ride._id, logger);
      ok(res, { rideId: String(ride._id), requeued: true });
    })
  );

  return router;
}

module.exports = { createDispatchRouter };
