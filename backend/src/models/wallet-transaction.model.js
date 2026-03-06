const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", default: null, index: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    direction: { type: String, enum: ["credit", "debit"], required: true },
    status: { type: String, default: "posted" },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

walletTransactionSchema.index({ customerId: 1, createdAt: -1 });

const WalletTransaction = mongoose.model("WalletTransaction", walletTransactionSchema);

module.exports = { WalletTransaction };
