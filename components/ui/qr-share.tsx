"use client";

import React from "react";
import QRCodeStyling from "qr-code-styling";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/v1/skiper101";


interface QRShareProps {
  url: string;
  size?: string;
}

export const QRShare = ({ url, size }: QRShareProps) => {
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
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          onClick={handleDownloadPng}
          className={"flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer " + (size === "100%" ? "w-full h-full" : "")}
          aria-label="Download QR Code as PNG"
        >
      <div
        ref={ref}
        className="dark:invert pointer-events-none overflow-hidden flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
        style={{ width: size || "clamp(2.5rem, 1.5rem + 2.5vw, 4rem)", height: size || "clamp(2.5rem, 1.5rem + 2.5vw, 4rem)" }}
      />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">Download QR</TooltipContent>
    </Tooltip>
  );
};
