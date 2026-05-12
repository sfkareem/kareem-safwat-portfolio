"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function useTypewriter(text: string, speed = 25) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const textRef = useRef(text);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  textRef.current = text;

  useEffect(() => {
    setDisplayed("");
    setIsTyping(true);
    indexRef.current = 0;

    frameRef.current = setInterval(() => {
      indexRef.current++;
      setDisplayed(textRef.current.slice(0, indexRef.current));
      if (indexRef.current >= textRef.current.length) {
        if (frameRef.current) clearInterval(frameRef.current);
        setIsTyping(false);
      }
    }, speed);

    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [speed]);

  useEffect(() => {
    setIsTyping(text.length > 0);
  }, [text]);

  return { displayed, isTyping, indexRef };
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
  const { displayed, isTyping, indexRef } = useTypewriter(text, speed);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!isTyping && indexRef.current >= text.length && text.length > 0) {
      onDoneRef.current?.();
    }
  }, [isTyping, text]);

  return (
    <span className={cn(className)}>
      {displayed}
      {isTyping && <span className="inline-block size-2 bg-green-400 rounded-full animate-pulse ml-0.5 align-middle" />}
    </span>
  );
}