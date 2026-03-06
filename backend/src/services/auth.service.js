const { OtpRequest } = require("../models/otp-request.model");
const { Session } = require("../models/session.model");
const { Customer } = require("../models/customer.model");
const { AppError } = require("../lib/errors");
const { createId } = require("../lib/ids");
const {
  compareHash,
  createAccessToken,
  createOtp,
  createRefreshToken,
  hashValue,
  verifyRefreshToken,
} = require("../lib/security");
const { env } = require("../config/env");
const { createOrUpdateCustomerProfile } = require("./customer.service");

function createSessionDeviceMeta(req) {
  return {
    userAgent: req.headers["user-agent"] || "",
    ip: req.ip,
  };
}

async function requestOtp(cache, mobile) {
  if (!cache) {
    throw new AppError("Cache service unavailable", 500);
  }
  if (!/^\d{10}$/.test(mobile || "")) {
    throw new AppError("Mobile number must be 10 digits");
  }

  const cooldownKey = `otp:cooldown:${mobile}`;
  const existingCooldown = await cache.get(cooldownKey);
  if (existingCooldown) {
    throw new AppError("OTP recently requested. Please wait before retrying.", 429);
  }

  const otp = createOtp();
  const codeHash = await hashValue(otp);
  const requestId = createId(12);
  const expiresAt = new Date(Date.now() + env.otpTtlSeconds * 1000);

  await OtpRequest.create({
    requestId,
    mobile,
    codeHash,
    expiresAt,
  });

  await cache.set(cooldownKey, "1", env.otpResendCooldownSeconds);

  return {
    requestId,
    resendAfter: env.otpResendCooldownSeconds,
    expiresAt,
    otpPreview: otp,
  };
}

async function verifyOtpAndLogin({ requestId, mobile, otp, profile, req }) {
  if (!requestId || !/^\d{10}$/.test(mobile || "") || !/^\d{6}$/.test(otp || "")) {
    throw new AppError("Invalid OTP verification payload");
  }

  const otpRequest = await OtpRequest.findOne({ requestId, mobile }).sort({ createdAt: -1 });
  if (!otpRequest) {
    throw new AppError("OTP request not found", 404);
  }

  if (otpRequest.verifiedAt) {
    throw new AppError("OTP already used", 400);
  }

  if (otpRequest.expiresAt.getTime() < Date.now()) {
    throw new AppError("OTP expired", 400);
  }

  if (otpRequest.attempts >= 5) {
    throw new AppError("Too many OTP attempts", 429);
  }

  const isValid = await compareHash(otp, otpRequest.codeHash);

  if (!isValid) {
    otpRequest.attempts += 1;
    await otpRequest.save();
    throw new AppError("Invalid OTP", 400);
  }

  otpRequest.verifiedAt = new Date();
  await otpRequest.save();

  const existingCustomer = await Customer.findOne({ mobile });

  const customer = await createOrUpdateCustomerProfile({
    mobile,
    fullName: profile?.fullName ?? existingCustomer?.fullName ?? "",
    city: profile?.city ?? existingCustomer?.city ?? env.defaultCity,
    defaultArea: profile?.defaultArea ?? existingCustomer?.defaultArea ?? "",
  });

  const accessToken = createAccessToken({ sub: String(customer._id), role: "customer" });
  const refreshToken = createRefreshToken({ sub: String(customer._id), role: "customer" });
  const refreshTokenHash = await hashValue(refreshToken);

  await Session.create({
    customerId: customer._id,
    refreshTokenHash,
    device: createSessionDeviceMeta(req),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
    customer,
  };
}

async function refreshCustomerSession(refreshToken) {
  if (!refreshToken) {
    throw new AppError("Missing refresh token", 400);
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError("Invalid refresh token", 401);
  }

  const session = await Session.findOne({
    customerId: payload.sub,
    revokedAt: null,
  }).sort({ createdAt: -1 });

  if (!session) {
    throw new AppError("Session not found", 401);
  }

  const matches = await compareHash(refreshToken, session.refreshTokenHash);
  if (!matches) {
    throw new AppError("Invalid session token", 401);
  }

  const accessToken = createAccessToken({ sub: payload.sub, role: payload.role });
  const nextRefreshToken = createRefreshToken({ sub: payload.sub, role: payload.role });
  session.refreshTokenHash = await hashValue(nextRefreshToken);
  await session.save();

  return {
    accessToken,
    refreshToken: nextRefreshToken,
  };
}

async function revokeRefreshToken(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    return;
  }

  const sessions = await Session.find({
    customerId: payload.sub,
    revokedAt: null,
  });

  for (const session of sessions) {
    const matches = await compareHash(refreshToken, session.refreshTokenHash);
    if (matches) {
      session.revokedAt = new Date();
      await session.save();
      return;
    }
  }
}

module.exports = {
  refreshCustomerSession,
  requestOtp,
  revokeRefreshToken,
  verifyOtpAndLogin,
};
