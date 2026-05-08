import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  redis = Redis.fromEnv();
  return redis;
}

const SESSION_TTL_S = 1800; // 30 minutes
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_S = 60; // 60 seconds

export async function getSessionMessages(sessionId: string): Promise<{ role: string; content: string }[]> {
  const client = getRedis();
  if (!client) return [];
  const key = `session:${sessionId}:messages`;
  const raw = await client.lrange(key, 0, -1);
  return raw.map((r: unknown) => {
    if (typeof r === "string") return JSON.parse(r);
    return r as { role: string; content: string };
  });
}

export async function appendSessionMessage(
  sessionId: string,
  message: { role: "user" | "assistant"; content: string }
) {
  const client = getRedis();
  if (!client) return;
  const key = `session:${sessionId}:messages`;
  await client.rpush(key, JSON.stringify(message));
  await client.expire(key, SESSION_TTL_S);
}

export async function checkRateLimit(
  sessionId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const client = getRedis();
  if (!client) return { allowed: true, remaining: 999 };
  const key = `rate:${sessionId}`;
  const count = await client.incr(key);
  if (count === 1) {
    await client.expire(key, RATE_LIMIT_WINDOW_S);
  }
  const remaining = Math.max(0, RATE_LIMIT_MAX - count);
  return { allowed: count <= RATE_LIMIT_MAX, remaining };
}
