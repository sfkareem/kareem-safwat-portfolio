"use client";

import { useState, useRef, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export function TerminalChat({
  messages,
  isLoading,
  onSend,
}: {
  messages: Message[];
  isLoading: boolean;
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    onSend(text);
  };

  return (
    <div className="flex flex-col">
      <div className="text-xs text-zinc-500 mb-2">
        ./agent — AI Assistant
      </div>

      {messages.length === 0 && (
        <div className="text-zinc-600 text-sm italic">
          No conversation history. Type a question to get started.
        </div>
      )}

      <div className="border-t border-zinc-800 pt-3 mt-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-green-400 text-sm shrink-0">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask about Kareem's work..."
            className="flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder-zinc-700"
            autoFocus
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
    </div>
  );
}
