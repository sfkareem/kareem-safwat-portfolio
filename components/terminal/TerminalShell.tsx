"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { TAB_LABELS, getTabContent, type TabId } from "./terminal-content";
import { TypewriterText } from "./TypewriterText";
import { TerminalChat } from "./TerminalChat";

function TerminalDot({ color }: { color: string }) {
  return <span className={cn("inline-block size-2.5 rounded-full", color)} />;
}

type CmdEntry = {
  id: string;
  command: string;
  output: string;
  isTyping: boolean;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

const WELCOME_SEQUENCE: { cmd: string; out: string }[] = [
  { cmd: "./assistant --interactive", out: "" },
  { cmd: "", out: "Type your questions to learn about Kareem's work." },
  { cmd: "", out: "Hello! I'm Kareem's AI assistant. Ask me anything about his work, skills, or experience." },
];

const STORAGE_KEY = "ai-terminal-history";

function loadHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // quota exceeded, silently fail
  }
}

export default function TerminalShell() {
  const [activeTab, setActiveTab] = useState<TabId>("whoami");
  const [entries, setEntries] = useState<CmdEntry[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [cmdInput, setCmdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>(loadHistory);
  const bodyRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const chatMessagesRef = useRef<Message[]>(chatMessages);

  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [entries, chatMessages]);

  // Welcome sequence on first load
  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      const startWelcome = async () => {
        for (const line of WELCOME_SEQUENCE) {
          await new Promise((r) => setTimeout(r, 600));
          setEntries((prev) => [
            ...prev,
            { id: crypto.randomUUID(), command: line.cmd, output: line.out, isTyping: false },
          ]);
        }
      };
      startWelcome();
    }
  }, [hasStarted]);

  const runCommand = (tab: TabId) => {
    setActiveTab(tab);
    if (tab === "./agent") return;
    const content = getTabContent(tab);
    const id = crypto.randomUUID();
    setEntries((prev) => [
      ...prev,
      { id, command: `$ ${tab}`, output: content, isTyping: true },
    ]);
  };

  const handleTabClick = (tab: TabId) => {
    runCommand(tab);
  };

  const sendChat = async (text: string, tabContext?: TabId) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    const current = chatMessagesRef.current;
    const updated = [...current, userMsg, assistantMsg];
    chatMessagesRef.current = updated;
    setChatMessages(updated);
    saveHistory(updated);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const history = [...current, userMsg].map((m) => ({
        role: m.role,
        content: m.content || " ",
      }));

      const systemContext = tabContext && tabContext !== "./agent"
        ? `The user is currently viewing the "${tabContext}" section of the portfolio. Answer in that context.`
        : "";

      const res = await fetch("/api/prototype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: systemContext
            ? [{ role: "system", content: systemContext }, ...history]
            : history,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: res.statusText }));
        const msgs = [...chatMessagesRef.current];
        const last = msgs[msgs.length - 1];
        if (last && last.role === "assistant") {
          last.content = `Error: ${errData.error || "Request failed"}`;
        }
        chatMessagesRef.current = msgs;
        setChatMessages(msgs);
        saveHistory(msgs);
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
              const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (chunk) {
                const msgs = [...chatMessagesRef.current];
                const last = msgs[msgs.length - 1];
                if (last && last.role === "assistant") {
                  last.content += chunk;
                }
                chatMessagesRef.current = msgs;
                setChatMessages(msgs);
                saveHistory(msgs);
              }
            } catch {
              // skip
            }
          }
        }
      }

      // Persist final state after stream ends
      saveHistory(chatMessagesRef.current);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        const msgs = [...chatMessagesRef.current];
        const last = msgs[msgs.length - 1];
        if (last && last.role === "assistant") {
          last.content = `Error: ${err.message || "Request failed"}`;
        }
        chatMessagesRef.current = msgs;
        setChatMessages(msgs);
        saveHistory(msgs);
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handlePromptSubmit = (e: FormEvent) => {
    e.preventDefault();
    const raw = cmdInput.trim();
    if (!raw || isLoading) return;
    setCmdInput("");

    const askMatch = raw.match(/^\$ ask (.+)/i);
    const cmdMatch = raw.match(/^\$ (\S+)/);

    if (askMatch) {
      sendChat(askMatch[1], activeTab);
    } else if (cmdMatch) {
      const cmd = cmdMatch[1];
      const matchedTab = TAB_LABELS.find((t) => t === cmd);
      if (matchedTab) {
        runCommand(matchedTab);
      } else if (cmd === "help") {
        setEntries((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            command: "$ help",
            output: [
              `Available commands:`,
              ...TAB_LABELS.map((t) => `  $ ${t.padEnd(12)} — View ${t} section`),
              `  $ ask <q>       — Ask the AI a question`,
              `  $ clear         — Clear terminal`,
              `  $ reset         — Clear chat history and reset`,
              `  $ help          — Show this help`,
            ].join("\n"),
            isTyping: false,
          },
        ]);
      } else if (cmd === "clear") {
        setEntries([]);
      } else if (cmd === "reset") {
        if (confirm("Clear all chat history? This cannot be undone.")) {
          setEntries([]);
          setChatMessages([]);
          saveHistory([]);
          chatMessagesRef.current = [];
          setHasStarted(false);
        }
      } else {
        setEntries((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            command: `$ ${raw}`,
            output: `Command not found: ${cmd}. Type $ help for available commands.`,
            isTyping: false,
          },
        ]);
      }
    } else {
      // Bare text → auto-interpret as $ ask
      sendChat(raw, activeTab);
    }
  };

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-mono flex flex-col overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <TerminalDot color="bg-red-500" />
          <TerminalDot color="bg-yellow-500" />
          <TerminalDot color="bg-green-500" />
        </div>
        <span className="text-xs text-zinc-600 ml-2">ai/terminal</span>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-950/90 shrink-0">
        {TAB_LABELS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={cn(
              "px-3 py-1.5 text-xs rounded border transition-colors",
              activeTab === tab
                ? "bg-zinc-800 border-zinc-600 text-zinc-100"
                : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Body area */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Command entries */}
        {entries.map((entry) => (
          <div key={entry.id} className="mb-3">
            {entry.command && (
              <div className="text-green-400 text-sm mb-1">
                <span className="text-green-400">$</span>{" "}
                <span>{entry.command.replace("$ ", "")}</span>
              </div>
            )}
            {entry.output && (
              <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                <span className="text-zinc-500">&gt;</span>{" "}
                {entry.isTyping ? (
                  <TypewriterText
                    text={entry.output}
                    speed={15}
                    onDone={() =>
                      setEntries((prev) =>
                        prev.map((e) =>
                          e.id === entry.id ? { ...e, isTyping: false } : e
                        )
                      )
                    }
                  />
                ) : (
                  entry.output
                )}
              </div>
            )}
          </div>
        ))}

        {/* Chat messages */}
        {chatMessages.length > 0 && chatMessages.map((msg) => (
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

        {isLoading && chatMessages.length > 0 && !chatMessages[chatMessages.length - 1]?.content && (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span className="inline-block size-2 bg-green-400 rounded-full animate-pulse" />
            Thinking...
          </div>
        )}

        {activeTab === "./agent" && (
          <TerminalChat
            messages={chatMessages}
            isLoading={isLoading}
            onSend={(text: string) => sendChat(text)}
          />
        )}
      </div>

      {/* Prompt bar */}
      {activeTab !== "./agent" && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 shrink-0">
          <form onSubmit={handlePromptSubmit} className="flex items-center gap-2">
            <span className="text-green-400 text-sm shrink-0">$</span>
            <input
              type="text"
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              placeholder="ask a question or type a command..."
              className="flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder-zinc-700"
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-1.5 text-[10px] text-zinc-700 border-t border-zinc-800 bg-zinc-950 shrink-0">
        gemini-3.1-flash-lite-preview · {chatMessages.length} messages
        <button
          onClick={() => {
            if (confirm("Clear all chat history? This cannot be undone.")) {
              setEntries([]);
              setChatMessages([]);
              saveHistory([]);
              chatMessagesRef.current = [];
              setHasStarted(false);
            }
          }}
          className="ml-4 text-zinc-700 hover:text-zinc-400 transition-colors underline underline-offset-2"
        >
          reset
        </button>
      </div>
    </div>
  );
}
