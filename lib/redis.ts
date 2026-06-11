import Redis from "ioredis";

const globalForRedis = global as unknown as { redis: Redis };

const redis =
  globalForRedis.redis ||
  new Redis(process.env.REDIS_URL!, {
    tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export default redis;
