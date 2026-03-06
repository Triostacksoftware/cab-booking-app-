const http = require("http");
const { Server } = require("socket.io");
const pino = require("pino");
const { connectToDatabase } = require("./config/db");
const { createCacheClient } = require("./config/redis");
const { env } = require("./config/env");
const { createApp } = require("./app");
const { setSocketServer } = require("./services/socket.service");
const { ensureSeedDrivers } = require("./services/driver.service");

async function bootstrap() {
  const logger = pino({ level: env.logLevel });
  const cache = createCacheClient(logger);
  if (typeof cache.connect === "function") {
    await cache.connect().catch(() => {
      logger.warn("Redis unavailable, continuing without remote cache");
    });
  }

  const { app } = createApp({ cache, logger });
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  setSocketServer(io);

  await connectToDatabase();
  await ensureSeedDrivers();

  server.listen(env.port, () => {
    logger.info({ port: env.port }, "Backend listening");
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
