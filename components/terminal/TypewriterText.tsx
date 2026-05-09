"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function useTypewriter(text: string, speed = 25) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(() => text.length > 0);
  const indexRef = useRef(0);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    setIsTyping(true);

    frameRef.current = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        if (frameRef.current) clearInterval(frameRef.current);
        setIsTyping(false);
      }
    }, speed);

    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [text, speed]);

  return { displayed, isTyping };
}

export function TypewriterText({
  text,
  speed = 25,
  className,
  onDone,
}: {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
}) {
  const { displayed, isTyping } = useTypewriter(text, speed);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!isTyping && displayed === text && text.length > 0) {
      doneRef.current?.();
    }
  }, [isTyping, displayed, text]);
  return (
    <span className={cn(className)}>
      {displayed}
      {isTyping && <span className="inline-block size-2 bg-green-400 rounded-full animate-pulse ml-0.5 align-middle" />}
    </span>
  );
}
