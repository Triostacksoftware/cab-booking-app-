const { Customer } = require("../models/customer.model");
const { Wallet } = require("../models/wallet.model");
const { env } = require("../config/env");

async function ensureCustomerWallet(customerId) {
  let wallet = await Wallet.findOne({ customerId });

  if (!wallet) {
    wallet = await Wallet.create({
      customerId,
      cashbackProgramState: {
        completedTrips: 0,
        targetTrips: env.customerCashbackTarget,
      },
    });
  }

  return wallet;
}

async function createOrUpdateCustomerProfile({ mobile, fullName, city, defaultArea }) {
  const customer = await Customer.findOneAndUpdate(
    { mobile },
    {
      $set: {
        mobile,
        ...(fullName !== undefined ? { fullName } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(defaultArea !== undefined ? { defaultArea } : {}),
        lastLoginAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  await ensureCustomerWallet(customer._id);
  return customer;
}

module.exports = {
  createOrUpdateCustomerProfile,
  ensureCustomerWallet,
};
