const mongoose = require("mongoose");

const otpRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, unique: true, index: true },
    mobile: { type: String, required: true, index: true },
    codeHash: { type: String, required: true },
    purpose: { type: String, default: "customer_auth" },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

otpRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpRequest = mongoose.model("OtpRequest", otpRequestSchema);

module.exports = { OtpRequest };
