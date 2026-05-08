import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const SESSION_TTL_MS = 1800; // 30 minutes in seconds
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60; // 60 seconds

export async function getSessionMessages(sessionId: string): Promise<{ role: string; content: string }[]> {
  const key = `session:${sessionId}:messages`;
  const raw = await redis.lrange(key, 0, -1);
  return raw.map((r: unknown) => {
    if (typeof r === "string") return JSON.parse(r);
    return r as { role: string; content: string };
  });
}

export async function appendSessionMessage(
  sessionId: string,
  message: { role: "user" | "assistant"; content: string }
) {
  const key = `session:${sessionId}:messages`;
  await redis.rpush(key, JSON.stringify(message));
  await redis.expire(key, SESSION_TTL_MS);
}

export async function checkRateLimit(
  sessionId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate:${sessionId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW_MS);
  }
  const remaining = Math.max(0, RATE_LIMIT_MAX - count);
  return { allowed: count <= RATE_LIMIT_MAX, remaining };
}
