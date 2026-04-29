"use client";

import * as React from "react";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import tinycolor from "tinycolor2";

interface ColorSelectorProps {
  defaultValue?: string;
  onToggle?: (active: boolean) => void;
}

const PRESET_COLORS = [
  "#71717a", // default
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#a855f7", // purple
  "#f97316", // orange
  "#ec4899", // pink
  "#14b8a6", // teal
];

export function ColorSelector({ defaultValue = "#71717a", onToggle, className }: ColorSelectorProps & { className?: string }) {
  const [selected, setSelected] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);

  const handleSelect = (color: string) => {
    setSelected(color);
    
    // Apply dynamic theme variables to root
    const root = document.documentElement;
    const tc = tinycolor(color);
    
    // Set primary color
    root.style.setProperty('--primary', color);
    
    // Calculate contrasting foreground color
    const isLight = tc.isLight();
    root.style.setProperty('--primary-foreground', isLight ? '#000000' : '#ffffff');
    
    // Also set a muted version for backgrounds
    root.style.setProperty('--primary-muted', tc.setAlpha(0.1).toRgbString());
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onToggle?.(newOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-5 md:size-7 lg:size-8 rounded-full bg-transparent transition-all hover:bg-background/10 shrink-0",
            open && "rotate-90",
            className
          )}
        >
          <Palette className="h-2.5 w-2.5 md:h-3.5 w-3.5 lg:h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        sideOffset={8}
        align="center"
        className="w-auto p-4 bg-popover/90 backdrop-blur-xl rounded-2xl border-0 shadow-2xl flex flex-col gap-4"
      >
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-center text-foreground/80">Theme Color</div>
          <HexColorPicker color={selected} onChange={handleSelect} className="!w-48 !h-48" />
        </div>
        
        <div className="grid grid-cols-4 gap-2 pt-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleSelect(color)}
              className={cn(
                "h-8 w-8 rounded-full transition-all hover:scale-110 shrink-0 flex items-center justify-center shadow-sm",
                selected.toLowerCase() === color.toLowerCase() ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
              )}
              style={{ backgroundColor: color }}
              aria-label={`Select ${color} theme`}
            >
              {selected.toLowerCase() === color.toLowerCase() && (
                <Check className="w-4 h-4 text-white drop-shadow-md" style={{ color: tinycolor(color).isLight() ? '#000' : '#fff' }} />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
