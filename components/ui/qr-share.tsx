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
            className="relative hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Download QR Code as PNG"
          >
            <div
              ref={ref}
              className="dark:invert pointer-events-none"
              style={{ width: "clamp(2rem, 1.5rem + 1.5vw, 3rem)", height: "clamp(2rem, 1.5rem + 1.5vw, 3rem)" }}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Download business card QR</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
