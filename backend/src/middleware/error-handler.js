function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const payload = {
    success: false,
    error: {
      message: error.message || "Internal server error",
    },
  };

  if (error.details) {
    payload.error.details = error.details;
  }

  res.status(statusCode).json(payload);
}

module.exports = { errorHandler };
