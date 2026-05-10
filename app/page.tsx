"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { HardHat, Code2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { FloatingFooter } from "@/components/ui/floating-footer"
import { QRShare } from "@/components/ui/qr-share"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/v1/skiper101"
import { ArrowIcon } from "@/components/v1/skiper99"

export default function Home() {
  const [baseUrl, setBaseUrl] = useState("")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBaseUrl(window.location.origin)
  }, [])

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,_var(--foreground)_1px,_transparent_1px)] opacity-15 [background-size:20px_20px] dark:bg-[radial-gradient(circle,_var(--foreground)_1px,_transparent_1px)]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="flex w-full max-w-6xl flex-col items-center" style={{ gap: "clamp(0.5rem, 0.5rem + 1vw, 1.5rem)" }}>
          <div className="items-center gap-6 md:flex">
            <p className="text-muted-foreground max-w-[200px] text-start leading-5 md:text-right" style={{ fontSize: "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)" }}>
              Senior Quantity Surveyor based in Cairo, Egypt — delivering precise cost management and tendering excellence.
            </p>
            <h1 className="leading-none font-light tracking-wider" style={{ fontSize: "clamp(1.8rem, 1rem + 5vw, 8rem)" }}>
              CIVIL
            </h1>
          </div>

          <div className="items-center gap-6 md:flex md:justify-center">
            <h1 className="flex flex-wrap leading-none font-light tracking-wider" style={{ fontSize: "clamp(1.8rem, 1rem + 5vw, 8rem)" }}>
              <span>ENGINEER</span>
              <span className="inline-flex items-center" style={{ whiteSpace: "nowrap" }}>
                <HardHat strokeWidth={1.5} className="text-primary" style={{ width: "1em", height: "1em" }} />
                NG
              </span>
            </h1>
            <p className="text-muted-foreground max-w-[220px] pt-4 leading-5 md:pt-8" style={{ fontSize: "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)" }}>
              FIDIC contracts, CCS Candy, BidBow, PlanSwift — precision in every estimate.
            </p>
          </div>

          <div className="items-center gap-6 md:flex">
            <p className="text-muted-foreground max-w-[200px] text-start leading-5 md:text-right" style={{ fontSize: "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)" }}>
              AI Vibe Coder building intelligent, scalable applications with agentic workflows.
            </p>
            <h1 className="leading-none font-light tracking-wider" style={{ fontSize: "clamp(1.8rem, 1rem + 5vw, 8rem)" }}>
              AI VIBE
            </h1>
          </div>

          <div className="items-center gap-6 md:flex md:justify-center">
            <h1 className="flex leading-none font-light tracking-wider" style={{ fontSize: "clamp(1.8rem, 1rem + 5vw, 8rem)" }}>
              <span className="inline-flex items-center" style={{ whiteSpace: "nowrap" }}>
                C
                <Code2 strokeWidth={1.5} className="text-primary" style={{ width: "1em", height: "1em" }} />
                DER
              </span>
            </h1>
          </div>
        </div>

        <div className="w-full max-w-4xl" style={{ marginTop: "clamp(1.5rem, 0.5rem + 4vw, 6rem)" }}>
          <Separator className="mb-6" />
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground" style={{ fontSize: "clamp(0.7rem, 0.65rem + 0.2vw, 0.875rem)" }}>
                CAIRO, EGYPT
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="font-semibold" style={{ fontSize: "clamp(0.7rem, 0.65rem + 0.2vw, 0.875rem)" }}>
                KAREEM SAFWAT
              </span>
              {baseUrl && (
                <div className="hidden md:flex">
                  <QRShare url={`${baseUrl}/businesscard`} size="clamp(2.5rem, 2rem + 6vw, 12rem)" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/civil"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-all hover:gap-3 hover:opacity-90 uppercase tracking-wider"
                    style={{ fontSize: "clamp(0.7rem, 0.65rem + 0.2vw, 0.875rem)" }}
                  >
                    Civil Portfolio <ArrowIcon className="size-3.5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  View civil engineering portfolio
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/ai"
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-semibold text-foreground transition-all hover:gap-3 hover:bg-accent uppercase tracking-wider"
                    style={{ fontSize: "clamp(0.7rem, 0.65rem + 0.2vw, 0.875rem)" }}
                  >
                    AI Portfolio <ArrowIcon className="size-3.5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  View AI development portfolio
                </TooltipContent>
              </Tooltip>
            </div>
            {baseUrl && (
              <div className="md:hidden self-stretch w-full">
                <div className="w-full aspect-square">
                  <QRShare url={`${baseUrl}/businesscard`} size="100%" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingFooter />
    </main>
  )
}
