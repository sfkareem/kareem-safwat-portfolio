"use client";

import React from "react";
import QRCodeStyling from "qr-code-styling";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QRShareProps {
  url: string;
}

export const QRShare = ({ url }: QRShareProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [qrCode, setQrCode] = React.useState<QRCodeStyling | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = "";

    const qr = new QRCodeStyling({
      width: 64,
      height: 64,
      data: url,
      type: "svg",
      margin: 0,
      backgroundOptions: {
        color: "transparent",
      },
      dotsOptions: {
        color: "currentColor",
        type: "rounded"
      },
      cornersSquareOptions: {
        color: "currentColor",
        type: "extra-rounded"
      }
    });

    setQrCode(qr);
    qr.append(ref.current);
  }, [url]);

  const handleDownloadPng = () => {
    if (qrCode) qrCode.download({ extension: "png", name: "business-card-qr" });
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={handleDownloadPng}
            className="relative hover:opacity-80 transition-opacity cursor-pointer group flex items-center gap-2"
            aria-label="Download QR Code as PNG"
          >
            <div ref={ref} className="dark:invert pointer-events-none size-10 md:size-12" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider hidden md:inline">
              Share Card
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Download business card QR</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
