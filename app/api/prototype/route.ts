import { checkRateLimit } from "@/lib/redis";

const model = process.env.GEMINI_PROTOTYPE_MODEL ?? "gemini-3.1-flash-lite-preview";

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "sessionId required" }), { status: 400 });
  }

  const { allowed, remaining } = await checkRateLimit(sessionId);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait before sending another message." }),
      { status: 429, headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" } }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), { status: 500 });
  }

  const contents = messages
    .filter((m: any) => m.role !== "system")
    .map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[prototype] Gemini API error:", errText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), { status: 502 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiRes.body!.getReader();
        const encoder = new TextEncoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        } catch (streamErr) {
          console.error("[prototype] Stream error:", streamErr);
          const errorEvent = encoder.encode("data: {\"error\":\"AI service temporarily unavailable\"}\n\n");
          try {
            controller.enqueue(errorEvent);
          } catch {
            // controller may already be closed
          }
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[prototype] Unexpected error:", err);
    return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), { status: 500 });
  }
}