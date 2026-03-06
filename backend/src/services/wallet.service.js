const { env } = require("../config/env");
const { Wallet } = require("../models/wallet.model");
const { WalletTransaction } = require("../models/wallet-transaction.model");
const { emitToCustomer, SOCKET_EVENT } = require("./socket.service");

async function getWalletSummary(customerId) {
  const wallet = await Wallet.findOne({ customerId }).lean();
  const transactions = await WalletTransaction.find({ customerId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  if (!wallet) {
    return {
      balance: 0,
      cashbackProgress: {
        completedTrips: 0,
        targetTrips: env.customerCashbackTarget,
        remainingTrips: env.customerCashbackTarget,
      },
      recentTransactions: [],
    };
  }

  return {
    balance: wallet.balance,
    cashbackProgress: {
      completedTrips: wallet.cashbackProgramState.completedTrips,
      targetTrips: wallet.cashbackProgramState.targetTrips,
      remainingTrips: Math.max(
        wallet.cashbackProgramState.targetTrips - wallet.cashbackProgramState.completedTrips,
        0
      ),
    },
    recentTransactions: transactions,
  };
}

async function getWalletTransactions(customerId, { cursor, limit = 10 }) {
  const query = { customerId };
  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  const items = await WalletTransaction.find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 10, 50))
    .lean();

  return {
    items,
    nextCursor: items.length ? items[items.length - 1].createdAt : null,
  };
}

async function applyTripCompletionToWallet({ customerId, rideId, amount }) {
  let wallet = await Wallet.findOne({ customerId });
  if (!wallet) {
    wallet = await Wallet.create({
      customerId,
      balance: 0,
      cashbackProgramState: {
        completedTrips: 0,
        targetTrips: env.customerCashbackTarget,
      },
    });
  }

  wallet.balance -= amount;
  wallet.cashbackProgramState.completedTrips += 1;

  await WalletTransaction.create({
    customerId,
    rideId,
    type: "trip_charge",
    amount,
    direction: "debit",
    title: "Trip Completed",
  });

  const qualifiesForCashback =
    wallet.cashbackProgramState.completedTrips > 0 &&
    wallet.cashbackProgramState.completedTrips % wallet.cashbackProgramState.targetTrips === 0;

  if (qualifiesForCashback) {
    wallet.balance += env.customerCashbackBonus;
    wallet.cashbackProgramState.lastBonusAt = new Date();

    await WalletTransaction.create({
      customerId,
      rideId,
      type: "cashback_bonus",
      amount: env.customerCashbackBonus,
      direction: "credit",
      title: "Cashback Bonus",
    });
  }

  await wallet.save();

  emitToCustomer(String(customerId), SOCKET_EVENT.WALLET_UPDATED, {
    customerId: String(customerId),
    balance: wallet.balance,
    completedTrips: wallet.cashbackProgramState.completedTrips,
    targetTrips: wallet.cashbackProgramState.targetTrips,
    serverTime: new Date().toISOString(),
  });

  return wallet;
}

module.exports = {
  applyTripCompletionToWallet,
  getWalletSummary,
  getWalletTransactions,
};
