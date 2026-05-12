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

const sanitizeId = (id: string): string =>
  id.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);

const SESSION_TTL_S = 1800; // 30 minutes
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_S = 60; // 60 seconds

export async function getSessionMessages(sessionId: string): Promise<{ role: string; content: string }[]> {
  const client = getRedis();
  if (!client) return [];
  const key = `session:${sanitizeId(sessionId)}:messages`;
  const raw = await client.lrange(key, 0, -1);
  return raw.map((r: unknown) => {
    if (typeof r === "string") {
      try {
        return JSON.parse(r);
      } catch (err) {
        console.error("[getSessionMessages] Failed to parse session message:", err);
        return null;
      }
    }
    return r as { role: string; content: string };
  }).filter(Boolean) as { role: string; content: string }[];
}

export async function appendSessionMessage(
  sessionId: string,
  message: { role: "user" | "assistant"; content: string }
) {
  const client = getRedis();
  if (!client) return;
  const key = `session:${sanitizeId(sessionId)}:messages`;
  await client.rpush(key, JSON.stringify(message));
  await client.expire(key, SESSION_TTL_S);
}

export async function checkRateLimit(
  sessionId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const client = getRedis();
  if (!client) return { allowed: false, remaining: 0 };
  const key = `rate:${sanitizeId(sessionId)}`;
  const count = await client.incr(key);
  if (count === 1) {
    await client.expire(key, RATE_LIMIT_WINDOW_S);
  }
  const remaining = Math.max(0, RATE_LIMIT_MAX - count);
  return { allowed: count <= RATE_LIMIT_MAX, remaining };
}
