const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pino = require("pino");
const { env } = require("./config/env");
const { createApiRouter } = require("./routes");
const { errorHandler } = require("./middleware/error-handler");

function createApp(dependencies = {}) {
  const app = express();
  const logger = dependencies.logger || pino({ level: env.logLevel });

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  app.use("/api/v1", createApiRouter({ ...dependencies, logger }));

  app.use(errorHandler);

  return { app, logger };
}

module.exports = { createApp };
