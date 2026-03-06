const { AppError } = require("../lib/errors");
const { verifyAccessToken } = require("../lib/security");

function requireAuth(role) {
  return function authMiddleware(req, _res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return next(new AppError("Missing access token", 401));
    }

    try {
      const payload = verifyAccessToken(token);
      if (role && payload.role !== role) {
        return next(new AppError("Forbidden", 403));
      }
      req.auth = payload;
      return next();
    } catch (error) {
      return next(new AppError("Invalid access token", 401));
    }
  };
}

module.exports = { requireAuth };
