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

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();

  if (!sessionId) {
    return Response.json({ error: "sessionId required" }, { status: 400 });
  }

  const { allowed, remaining } = await checkRateLimit(sessionId);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please wait before sending another message." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const systemPrompt = buildSystemPrompt();
  const history = await getSessionMessages(sessionId);

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system: systemPrompt,
    messages: [...history, ...messages],
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
      const lastMsg = response.messages[response.messages.length - 1];
      if (lastMsg?.role === "assistant") {
        const content = Array.isArray(lastMsg.content)
          ? lastMsg.content.map((c) => ("text" in c ? c.text : "")).join("")
          : lastMsg.content;
        await appendSessionMessage(sessionId, { role: "assistant", content });
      }
    },
  });

  return result.toDataStreamResponse();
}
