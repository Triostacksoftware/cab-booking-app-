const { AppError } = require("../lib/errors");
const { Payment } = require("../models/payment.model");
const { createId } = require("../lib/ids");
const { signWebhookBody } = require("../lib/security");

async function createUpiOrder({ customerId, rideId, amount }) {
  if (!amount || amount <= 0) {
    throw new AppError("Amount must be greater than zero");
  }

  const payment = await Payment.create({
    customerId,
    rideId: rideId || null,
    method: "UPI",
    providerReference: `upi_${createId(12)}`,
    amount,
    metadata: {
      qrIntent: `upi://pay?am=${amount}`,
    },
  });

  return payment;
}

function verifyWebhookSignature(rawBody, signature) {
  return signWebhookBody(rawBody) === signature;
}

async function markPaymentFromWebhook({ providerReference, status, metadata }) {
  const payment = await Payment.findOne({ providerReference });
  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  payment.status = status;
  payment.metadata = { ...payment.metadata, ...metadata };
  await payment.save();
  return payment;
}

module.exports = {
  createUpiOrder,
  markPaymentFromWebhook,
  verifyWebhookSignature,
};
