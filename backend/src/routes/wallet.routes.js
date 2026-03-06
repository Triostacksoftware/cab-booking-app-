const express = require("express");
const { asyncHandler } = require("../lib/async-handler");
const { ok } = require("../lib/http");
const { requireAuth } = require("../middleware/auth");
const { getWalletSummary, getWalletTransactions } = require("../services/wallet.service");

function createWalletRouter() {
  const router = express.Router();

  router.use(requireAuth("customer"));

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const summary = await getWalletSummary(req.auth.sub);
      ok(res, summary);
    })
  );

  router.get(
    "/transactions",
    asyncHandler(async (req, res) => {
      const summary = await getWalletTransactions(req.auth.sub, {
        cursor: req.query.cursor,
        limit: req.query.limit,
      });
      ok(res, summary);
    })
  );

  return router;
}

module.exports = { createWalletRouter };
