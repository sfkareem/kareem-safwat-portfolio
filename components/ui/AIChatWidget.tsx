"use client";

import React, { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { MessageCircle, X, Send, Bot, User, Loader2, RefreshCcw, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [sessionId, setSessionId] = React.useState<string>("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id = localStorage.getItem("agent-session-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("agent-session-id", id);
    }
    setSessionId(id);
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, error } =
    useChat({
      api: "/api/chat",
      body: { sessionId },
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your Agentic Portfolio Assistant. How can I help you explore Kareem's work today?",
        },
      ],
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your Agentic Portfolio Assistant. How can I help you explore Kareem's work today?",
      },
    ]);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed bottom-24 md:bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open chat"
            className="bg-primary/90 backdrop-blur-sm text-primary-foreground p-4 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            <MessageCircle />
          </motion.button>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden"
          >
            <div className="p-4 flex justify-between items-center bg-background/50">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-sm">AI Assistant</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Start fresh"
                  aria-label="Clear chat"
                  className="hover:bg-muted p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  aria-label="Close chat"
                  className="hover:bg-muted p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-2 group",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {m.role === "assistant" && (
                    <Bot className="w-6 h-6 mt-1 text-primary shrink-0" />
                  )}
                  <div className="relative max-w-[80%]">
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-sm prose prose-sm dark:prose-invert",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50"
                      )}
                    >
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                    {m.role === "assistant" && m.content && (
                      <button
                        onClick={() => copyToClipboard(m.content, i)}
                        className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                        title="Copy message"
                      >
                        {copiedIndex === i ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
                  </div>
                  {m.role === "user" && (
                    <User className="w-6 h-6 mt-1 text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 items-center text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                </div>
              )}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  Sorry, I'm having trouble connecting right now.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-border/50 flex gap-2 bg-background/50"
            >
              <input
                value={input}
                onChange={handleInputChange}
                className="flex-1 bg-transparent border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ask about Kareem..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
