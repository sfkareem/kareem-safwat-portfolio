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
      width: 150,
      height: 150,
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
            className="relative hover:scale-105 transition-transform cursor-pointer group flex items-center justify-center"
            aria-label="Download QR Code as PNG"
          >
            <div ref={ref} className="dark:invert pointer-events-none" />
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/50 dark:text-white/50">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" x2="12" y1="15" y2="3"/>
              </svg>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Click to download QR Code as PNG</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
