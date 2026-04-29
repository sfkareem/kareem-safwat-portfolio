"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MessageCircle, X, Send, Bot, User, Loader2, RefreshCcw, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import portfolioData from "@/data/portfolio.json";

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!key) {
      console.error('NEXT_PUBLIC_GEMINI_API_KEY is missing');
      return null;
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

type Message = { role: 'user' | 'assistant', text: string };

const INITIAL_MESSAGE = { role: 'assistant' as const, text: "Hello! I'm your Agentic Portfolio Assistant. How can I help you explore Kareem's work today?" };
const EXPIRATION_TIME_MS = 60 * 60 * 1000; // 1 hour

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("portfolio-chat-session");
    if (savedData) {
      try {
        const { messages, timestamp } = JSON.parse(savedData);
        if (Date.now() - timestamp > EXPIRATION_TIME_MS) {
          // Expired
          setMessages([INITIAL_MESSAGE]);
          localStorage.removeItem("portfolio-chat-session");
        } else {
          setMessages(messages);
        }
      } catch (e) {
        setMessages([INITIAL_MESSAGE]);
      }
    } else {
      // Check for old format and clear it
      localStorage.removeItem("portfolio-chat-history");
      setMessages([INITIAL_MESSAGE]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("portfolio-chat-session", JSON.stringify({
        messages,
        timestamp: Date.now()
      }));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem("portfolio-chat-session");
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const client = getAI();
      if (!client) {
        setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm not configured correctly to chat." }]);
        setIsThinking(false);
        return;
      }

      const responseStream = await client.models.generateContentStream({
        model: "gemini-2.5-flash-lite",
        contents: input,
        config: {
          systemInstruction: `You are Kareem Safwat's AI representative. Be extremely short, direct, and concise. Get straight to the point.

CRITICAL RULES:
1. Use ONLY the provided portfolio data, which represents the exact content of Kareem's portfolio pages. NEVER refer to any dataset, pre-trained data, or outside information. When answering, speak as if you are reading directly from his portfolio website.
2. Do not invent, hallucinate, or infer any experience or skills not explicitly listed.
3. Keep responses as brief as possible.
4. If asked about something completely unrelated to the portfolio data, state clearly that you only have information based on Kareem's portfolio website and direct them to his contact information.

Portfolio Page Data: ${JSON.stringify(portfolioData)}`,
        },
      });

      let assistantResponse = "";
      setMessages(prev => [...prev, { role: 'assistant', text: "" }]);

      for await (const chunk of responseStream) {
        const text = chunk.text || "";
        assistantResponse += text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = assistantResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="bg-primary/90 backdrop-blur-sm text-primary-foreground p-4 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            <MessageCircle />
          </motion.button>
        ) : (
          <motion.div
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
                  className="hover:bg-muted p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCcw size={14} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  title="Close"
                  className="hover:bg-muted p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-2 group", m.role === 'user' ? "justify-end" : "justify-start")}>
                  {m.role === 'assistant' && <Bot className="w-6 h-6 mt-1 text-primary shrink-0" />}
                  <div className="relative max-w-[80%]">
                    <div className={cn("p-3 rounded-2xl text-sm prose prose-sm dark:prose-invert", m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted/50")}>
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                    {m.role === 'assistant' && m.text && (
                      <button 
                        onClick={() => copyToClipboard(m.text, i)}
                        className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                        title="Copy message"
                      >
                        {copiedIndex === i ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                  {m.role === 'user' && <User className="w-6 h-6 mt-1 text-muted-foreground shrink-0" />}
                </div>
              ))}
              {isThinking && (
                <div className="flex gap-2 items-center text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-border/50 flex gap-2 bg-background/50">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-transparent border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ask about Kareem..."
              />
              <button onClick={sendMessage} className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
