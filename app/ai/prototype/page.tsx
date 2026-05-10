"use client";

import { useState, useRef, type FormEvent, useEffect } from "react";
import { cn } from "@/lib/utils";

type Mode = "command" | "bar" | "split";

const MODE_LABELS: Record<Mode, string> = {
  command: "$ ask <question>",
  bar: "Dedicated Input Bar",
  split: "Split View",
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function TerminalDot({ color }: { color: string }) {
  return <span className={cn("inline-block size-2.5 rounded-full", color)} />;
}

export default function PrototypePage() {
  const [mode, setMode] = useState<Mode>("command");
  const [cmdInput, setCmdInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const cmdInputRef = useRef<HTMLInputElement>(null);
  const [displayMessages, setDisplayMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm Kareem's AI assistant. Ask me anything about his work, skills, or experience.",
    },
  ]);
  const messagesRef = useRef<Message[]>(displayMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const welcomeMsg = displayMessages[0];

  useEffect(() => {
    messagesRef.current = displayMessages;
  }, [displayMessages]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayMessages]);

  const sendMessage = async (text: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    const currentMessages = messagesRef.current;
    const newMessages = [...currentMessages, userMsg, assistantMsg];
    messagesRef.current = newMessages;
    setDisplayMessages(newMessages);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const history = [...currentMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content || " ",
      }));

      const res = await fetch("/api/prototype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: res.statusText }));
        const updated = [...messagesRef.current];
        const last = updated[updated.length - 1];
        if (last && last.role === "assistant") {
          last.content = `Error: ${errData.error || "Request failed"}`;
        }
        messagesRef.current = updated;
        setDisplayMessages(updated);
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const json = line.slice(6).trim();
            if (!json || json === "[DONE]") continue;
            try {
              const parsed = JSON.parse(json);
              const text =
                parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (text) {
                const updated = [...messagesRef.current];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  last.content += text;
                }
                messagesRef.current = updated;
                setDisplayMessages(updated);
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        const updated = [...messagesRef.current];
        const last = updated[updated.length - 1];
        if (last && last.role === "assistant") {
          last.content = `Error: ${err.message || "Request failed"}`;
        }
        messagesRef.current = updated;
        setDisplayMessages(updated);
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim() || isLoading) return;
    const question = cmdInput.trim();
    setCmdInput("");
    sendMessage(question);
  };

  const handleBarSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput("");
    sendMessage(question);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setCmdInput("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-6 flex flex-col">
      <div className="max-w-5xl w-full mx-auto mb-4">
        <h1 className="text-sm text-zinc-500 mb-3">ai/terminal — prototype</h1>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={cn(
                "px-3 py-1.5 text-xs rounded border transition-colors",
                mode === m
                  ? "bg-zinc-800 border-zinc-600 text-zinc-100"
                  : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              )}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 select-none">
          <div className="flex items-center gap-1.5">
            <TerminalDot color="bg-red-500" />
            <TerminalDot color="bg-yellow-500" />
            <TerminalDot color="bg-green-500" />
          </div>
          <span className="text-xs text-zinc-600 ml-2">ai/assistant — {MODE_LABELS[mode]}</span>
        </div>

        <div className={cn("flex-1 flex", mode === "split" ? "flex-col md:flex-row" : "flex-col")}>
          <div
            ref={terminalRef}
            className={cn(
              "overflow-y-auto p-4 space-y-2",
              mode === "split" ? "flex-1 border-b md:border-b-0 md:border-r border-zinc-800" : "flex-1"
            )}
          >
            <div className="text-green-400 text-sm mb-4">
              <span className="text-green-400">$</span> ./assistant --interactive
            </div>
            <div className="text-zinc-400 text-xs mb-2">
              &gt; Type your questions to learn about Kareem&apos;s work.
            </div>

            {displayMessages.map((msg) => (
              <div key={msg.id} className="mb-3">
                {msg.role === "user" ? (
                  <div>
                    <span className="text-green-400 text-sm">$</span>{" "}
                    <span className="text-zinc-200 text-sm">{msg.content}</span>
                  </div>
                ) : (
                  <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                    <span className="text-zinc-500">&gt;</span>{" "}
                    {msg.content || (
                      <span className="inline-block size-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && !displayMessages[displayMessages.length - 1]?.content && (
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <span className="inline-block size-2 bg-green-400 rounded-full animate-pulse" />
                Thinking...
              </div>
            )}

            {mode === "command" && !isLoading && (
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mt-2">
                <span className="text-green-400 text-sm shrink-0">$ ask</span>
                <input
                  ref={cmdInputRef}
                  type="text"
                  value={cmdInput}
                  onChange={(e) => setCmdInput(e.target.value)}
                  placeholder="your question..."
                  className="flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder-zinc-700"
                  autoFocus
                />
              </form>
            )}
          </div>

          {mode === "split" && (
            <div className="w-full md:w-80 flex flex-col bg-zinc-950/50">
              <div className="px-4 py-2 text-xs text-zinc-600 border-b border-zinc-800">
                Chat Panel
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {displayMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "p-2 rounded text-xs leading-relaxed",
                      msg.role === "user"
                        ? "bg-zinc-800 text-zinc-200 ml-4"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    )}
                  >
                    <div className="font-bold mb-0.5 text-[10px] uppercase tracking-wider text-zinc-600">
                      {msg.role === "user" ? "You" : "AI"}
                    </div>
                    {msg.content || (
                      <span className="inline-block size-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-zinc-800">
                <form onSubmit={handleBarSubmit} className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-zinc-700 placeholder-zinc-700"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-300 disabled:opacity-50 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {mode === "bar" && (
          <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3">
            <form onSubmit={handleBarSubmit} className="flex items-center gap-2">
              <span className="text-green-400 text-sm shrink-0">&gt;</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ask about Kareem's work..."
                className="flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder-zinc-700"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "..." : "$"}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="max-w-5xl w-full mx-auto mt-4 text-xs text-zinc-700">
        gemini-3.1-flash-lite-preview · {displayMessages.length} messages
      </div>
    </div>
  );
}
