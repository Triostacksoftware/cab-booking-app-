const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, unique: true, index: true },
    balance: { type: Number, default: 0 },
    cashbackProgramState: {
      completedTrips: { type: Number, default: 0 },
      targetTrips: { type: Number, default: 10 },
      lastBonusAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = { Wallet };
