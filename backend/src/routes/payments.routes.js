const express = require("express");
const { asyncHandler } = require("../lib/async-handler");
const { ok } = require("../lib/http");
const { requireAuth } = require("../middleware/auth");
const {
  createUpiOrder,
  markPaymentFromWebhook,
  verifyWebhookSignature,
} = require("../services/payment.service");
const { AppError } = require("../lib/errors");

function createPaymentsRouter() {
  const router = express.Router();

  router.post(
    "/upi/order",
    requireAuth("customer"),
    asyncHandler(async (req, res) => {
      const payment = await createUpiOrder({
        customerId: req.auth.sub,
        rideId: req.body.rideId,
        amount: req.body.amount,
      });
      ok(res, payment, 201);
    })
  );

  router.post(
    "/upi/webhook",
    asyncHandler(async (req, res) => {
      const rawBody = JSON.stringify(req.body);
      const signature = req.headers["x-signature"];
      if (!verifyWebhookSignature(rawBody, signature)) {
        throw new AppError("Invalid webhook signature", 401);
      }

      const payment = await markPaymentFromWebhook(req.body);
      ok(res, payment);
    })
  );

  return router;
}

module.exports = { createPaymentsRouter };
