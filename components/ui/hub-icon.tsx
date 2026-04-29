import * as React from "react";
import { cn } from "@/lib/utils";

export function HubIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-current", className)}
    >
      <defs>
        <linearGradient id="k-metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Stem - 3D Pillar */}
      <path d="M20 20 H35 V80 H20 V20Z" fill="url(#k-metal-grad)" />
      <path d="M35 20 L45 30 V70 L35 80 V20Z" fill="currentColor" fillOpacity="0.4" />
      
      {/* Upper Arm - 3D Beam */}
      <path d="M45 45 L80 10 H65 L45 30 V45Z" fill="url(#k-metal-grad)" />
      <path d="M80 10 L90 20 L55 55 L45 45 L80 10Z" fill="currentColor" fillOpacity="0.2" />
      
      {/* Lower Arm - 3D Beam */}
      <path d="M45 55 V70 L65 90 H80 L45 55Z" fill="url(#k-metal-grad)" />
      <path d="M80 90 L90 80 L55 45 L45 55 L80 90Z" fill="currentColor" fillOpacity="0.2" />
      
      {/* AI Nodes - Neural Points */}
      <circle cx="45" cy="50" r="2.5" fill="currentColor" />
      <circle cx="90" cy="20" r="1.5" fill="currentColor" fillOpacity="0.6" />
      <circle cx="90" cy="80" r="1.5" fill="currentColor" fillOpacity="0.6" />
      
      {/* Laser Connections - Engineered Precision */}
      <path d="M45 50 L90 20 M45 50 L90 80" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
      
      {/* Structural Frame Accents */}
      <path d="M10 10 V25 M10 10 H25 M75 10 H90 M90 10 V25 M10 75 V90 M10 90 H25 M75 90 H90 M90 90 V75" 
            stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
    </svg>
  );
}
