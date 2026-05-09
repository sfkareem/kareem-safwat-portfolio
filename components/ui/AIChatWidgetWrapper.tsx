"use client";

import { usePathname } from "next/navigation";
import { AIChatWidget } from "./AIChatWidget";

export function AIChatWidgetWrapper() {
  const pathname = usePathname();
  if (pathname === "/ai") return null;
  return <AIChatWidget />;
}
