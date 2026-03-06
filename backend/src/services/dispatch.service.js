const { Ride } = require("../models/ride.model");
const {
  assignNearestDriver,
  exposeRideOtp,
  moveRideToArriving,
} = require("./ride.service");

function scheduleRideDispatch(rideId, logger) {
  setTimeout(async () => {
    try {
      const ride = await Ride.findById(rideId);
      if (!ride || ride.status !== "SEARCHING_DRIVER") return;

      const assigned = await assignNearestDriver(ride);
      if (!assigned) return;

      setTimeout(async () => {
        try {
          const currentRide = await Ride.findById(rideId);
          if (!currentRide || currentRide.status !== "DRIVER_ASSIGNED") return;
          await moveRideToArriving(rideId);

          setTimeout(async () => {
            try {
              const latestRide = await Ride.findById(rideId);
              if (!latestRide || latestRide.status !== "DRIVER_ARRIVING") return;
              await exposeRideOtp(rideId);
            } catch (error) {
              logger.warn({ error: error.message, rideId }, "Failed while exposing ride OTP");
            }
          }, 2000);
        } catch (error) {
          logger.warn({ error: error.message, rideId }, "Failed while moving ride to arriving");
        }
      }, 2000);
    } catch (error) {
      logger.warn({ error: error.message, rideId }, "Failed during dispatch");
    }
  }, 1500);
}

module.exports = { scheduleRideDispatch };
