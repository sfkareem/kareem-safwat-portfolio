import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/agent/prompt";
import {
  getPortfolioOverview,
  getExperience,
  getSkills,
  getCertificationsByCategory,
  getProjects,
  getContactInfo,
  searchPortfolio,
} from "@/lib/agent/tools";
import { getSessionMessages, appendSessionMessage, checkRateLimit } from "@/lib/redis";

const isValidUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function POST(req: Request) {
  // Issue 6: Body size check
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 10 * 1024) {
    return Response.json({ error: "Request body too large" }, { status: 413 });
  }

  let messages: any[];
  let sessionId: string;
  try {
    const body = await req.json();
    messages = body.messages;
    sessionId = body.sessionId;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Issue 5: UUID v4 validation
  if (!sessionId || !isValidUUID(sessionId)) {
    return Response.json({ error: "Invalid or missing sessionId" }, { status: 400 });
  }

  // Issue 6: Message limits
  if (!Array.isArray(messages) || messages.length > 100) {
    return Response.json({ error: "Messages array must have ≤ 100 items" }, { status: 400 });
  }
  for (const msg of messages) {
    const content = typeof msg.content === "string" ? msg.content : "";
    if (content.length > 4096) {
      return Response.json({ error: "Each message content must be ≤ 4096 characters" }, { status: 400 });
    }
  }

  const { allowed, remaining } = await checkRateLimit(sessionId);
  if (!allowed) {
    const reset = Math.floor(Date.now() / 1000) + 60;
    return Response.json(
      { error: "Too many requests. Please wait before sending another message." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": "30",
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
        },
      }
    );
  }

  const systemPrompt = buildSystemPrompt();
  const history = await getSessionMessages(sessionId);

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system: systemPrompt,
    messages: [...history, ...messages],
    maxTokens: 8192,
    tools: {
      getPortfolioOverview: tool({
        description: "Get Kareem's name, title, tagline, and professional summary",
        parameters: z.object({}),
        execute: async () => getPortfolioOverview(),
      }),
      getExperience: tool({
        description: "Get Kareem's complete work history including current role",
        parameters: z.object({}),
        execute: async () => getExperience(),
      }),
      getSkills: tool({
        description: "Get Kareem's technical skills and tools for both civil engineering and AI development",
        parameters: z.object({}),
        execute: async () => getSkills(),
      }),
      getCertifications: tool({
        description: "Get Kareem's certifications, optionally filtered by category (civil or ai)",
        parameters: z.object({
          category: z.enum(["civil", "ai"]).optional().describe("Filter by category"),
        }),
        execute: async ({ category }) => getCertificationsByCategory(category),
      }),
      getProjects: tool({
        description: "Get Kareem's featured projects",
        parameters: z.object({}),
        execute: async () => getProjects(),
      }),
      getContactInfo: tool({
        description: "Get Kareem's email, LinkedIn, Twitter, and phone numbers",
        parameters: z.object({}),
        execute: async () => getContactInfo(),
      }),
      searchPortfolio: tool({
        description: "Search across all portfolio data for a keyword",
        parameters: z.object({
          query: z.string().describe("Keyword to search for"),
        }),
        execute: async ({ query }) => searchPortfolio(query),
      }),
    },
    onFinish: async ({ response }) => {
      console.log("[chat] onFinish triggered, response messages:", response.messages.length);
      try {
        // Issue 3: Store user messages too
        for (const msg of response.messages) {
          const role = msg.role as string;
          if (role === "user" || role === "assistant") {
            const content =
              typeof msg.content === "string"
                ? msg.content
                : Array.isArray(msg.content)
                  ? (msg.content as any[]).map((c) => ("text" in c ? c.text : "")).join("")
                  : "";
            if (content) {
              await appendSessionMessage(sessionId, { role: role as "user" | "assistant", content });
            }
          }
        }
      } catch (err) {
        console.error("[chat] onFinish: failed to persist messages:", err);
      }
    },
  });

  return result.toDataStreamResponse();
}