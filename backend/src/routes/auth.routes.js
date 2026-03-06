const express = require("express");
const { asyncHandler } = require("../lib/async-handler");
const { ok } = require("../lib/http");
const {
  refreshCustomerSession,
  requestOtp,
  revokeRefreshToken,
  verifyOtpAndLogin,
} = require("../services/auth.service");

function createAuthRouter({ cache }) {
  const router = express.Router();

  router.post(
    "/request-otp",
    asyncHandler(async (req, res) => {
      const { mobile, role } = req.body;
      const result = await requestOtp(cache, mobile, role);
      ok(res, result, 201);
    })
  );

  router.post(
    "/verify-otp",
    asyncHandler(async (req, res) => {
      const { requestId, mobile, otp, profile } = req.body;
      const result = await verifyOtpAndLogin({ requestId, mobile, otp, profile, req });
      ok(res, result);
    })
  );

  router.post(
    "/refresh",
    asyncHandler(async (req, res) => {
      const result = await refreshCustomerSession(req.body.refreshToken);
      ok(res, result);
    })
  );

  router.post(
    "/logout",
    asyncHandler(async (req, res) => {
      await revokeRefreshToken(req.body.refreshToken);
      ok(res, { loggedOut: true });
    })
  );

  return router;
}

module.exports = { createAuthRouter };
