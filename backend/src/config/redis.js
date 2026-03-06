const Redis = require("ioredis");
const { env } = require("./env");

class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key, value, ttlSeconds) {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  async del(key) {
    this.store.delete(key);
  }
}

function createCacheClient(logger) {
  if (!env.redisUrl) {
    logger.warn("REDIS_URL missing, using in-memory cache fallback");
    return new MemoryCache();
  }

  const client = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  client.on("error", (error) => {
    logger.warn({ error: error.message }, "Redis connection error");
  });

  return {
    async get(key) {
      return client.get(key);
    },
    async set(key, value, ttlSeconds) {
      if (ttlSeconds) {
        await client.set(key, value, "EX", ttlSeconds);
        return;
      }
      await client.set(key, value);
    },
    async del(key) {
      await client.del(key);
    },
    async connect() {
      await client.connect();
    },
  };
}

module.exports = { createCacheClient };
