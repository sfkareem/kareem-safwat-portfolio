"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, HardHat, Code2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { FloatingFooter } from "@/components/ui/floating-footer"
import { QRShare } from "@/components/ui/qr-share"

export default function Home() {
  const [baseUrl, setBaseUrl] = useState("")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBaseUrl(window.location.origin)
  }, [])

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,_var(--foreground)_1px,_transparent_1px)] opacity-15 [background-size:20px_20px] dark:bg-[radial-gradient(circle,_var(--foreground)_1px,_transparent_1px)]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <div className="flex w-full max-w-6xl flex-col items-center gap-4">
          <div className="items-center gap-6 md:flex">
            <p className="text-muted-foreground max-w-[200px] text-start text-xs leading-5 md:text-right md:text-sm">
              Senior Quantity Surveyor based in Riyadh, KSA — delivering precise cost management and tendering excellence.
            </p>
            <h1 className="text-5xl leading-none font-light tracking-wider md:text-7xl xl:text-[8rem]">
              CIVIL
            </h1>
          </div>

          <div className="items-center gap-6 md:flex md:justify-center">
            <h1 className="flex text-5xl leading-none font-light tracking-wider md:text-7xl xl:text-[8rem]">
              <span>ENGINEER</span>
              <HardHat strokeWidth={1.5} className="text-primary size-10 md:size-14 xl:size-28" />
              <span>NG</span>
            </h1>
            <p className="text-muted-foreground max-w-[220px] pt-4 text-xs leading-5 md:pt-8 md:text-sm">
              FIDIC contracts, CCS Candy, BidBow, PlanSwift — precision in every estimate.
            </p>
          </div>

          <div className="items-center gap-6 md:flex">
            <p className="text-muted-foreground max-w-[200px] text-start text-xs leading-5 md:text-right md:text-sm">
              AI Vibe Coder building intelligent, scalable applications with agentic workflows.
            </p>
            <h1 className="text-5xl leading-none font-light tracking-wider md:text-7xl xl:text-[8rem]">
              AI VIBE
            </h1>
          </div>

          <div className="items-center gap-6 md:flex md:justify-center">
            <h1 className="flex text-5xl leading-none font-light tracking-wider md:text-7xl xl:text-[8rem]">
              <span>C</span>
              <Code2 strokeWidth={1.5} className="text-primary size-10 md:size-14 xl:size-28" />
              <span>DER</span>
            </h1>
          </div>
        </div>

        <div className="mt-16 w-full max-w-4xl">
          <Separator className="mb-6" />
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground md:text-sm">
                RIYADH, KSA
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="text-sm font-semibold md:text-base">
                KAREEM SAFWAT
              </span>
              {baseUrl && (
                <QRShare url={`${baseUrl}/businesscard`} />
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/civil"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:gap-3 hover:opacity-90 uppercase tracking-wider"
              >
                Civil Portfolio <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold text-foreground transition-all hover:gap-3 hover:bg-accent uppercase tracking-wider"
              >
                AI Portfolio <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <FloatingFooter />
    </main>
  )
}
