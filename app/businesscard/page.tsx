"use client";

import { useEffect, useState } from "react";
import { Download, Phone, FileBadge, AppWindow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { SocialIcons } from "@/components/ui/social-icons";
import { GlobePulse } from "@/components/ui/globe-pulse";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";
import portfolioData from "@/data/portfolio.json";
import Image from "next/image";

const GmailIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}>
    <title>Gmail</title>
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}>
    <title>WhatsApp</title>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function BusinessCardPage() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.origin);
  }, []);

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${portfolioData.personal.name}
TITLE:Senior Quantity Surveyor & AI Vibe Coder
ORG:Constructing Value & Control
TEL;TYPE=CELL,VOICE:${portfolioData.personal.contact.phone.egypt}
TEL;TYPE=WORK,VOICE:${portfolioData.personal.contact.phone.ksa}
EMAIL:${portfolioData.personal.contact.email}
URL:${url}
NOTE:Senior Quantity Surveyor with 9+ years of experience. AI Vibe Coder and Agentic Software Developer.
END:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${portfolioData.personal.name.replace(" ", "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none z-0" />
      
      {/* Globe Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-60 pointer-events-none">
        <div className="w-full max-w-[800px] aspect-square">
          <GlobePulse />
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 z-10">
        <GlowCard glowColor="blue" customSize className="w-full bg-transparent backdrop-blur-md border-zinc-800/30 text-zinc-100 p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-xl">
              <Image 
                src={portfolioData.personal.profileImage} 
                alt={portfolioData.personal.name} 
                fill 
                className="object-cover object-top" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{portfolioData.personal.name}</h1>
              <p className="text-blue-400 font-medium mt-1">Senior Quantity Surveyor <span className="text-zinc-600 mx-1">|</span> AI Vibe Coder</p>
              <p className="text-zinc-400 text-sm mt-2 max-w-xs mx-auto">{portfolioData.personal.tagline}</p>
            </div>
          </div>

          <div className="flex justify-center mt-6 mb-8">
            <SocialIcons />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a href={`mailto:${portfolioData.personal.contact.email}`} className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10" title="Email Me">
              <GmailIcon className="w-5 h-5 text-red-400" />
            </a>

            <a href={`tel:${portfolioData.personal.contact.phone.egypt}`} className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10" title="Call (Egypt)">
              <Phone className="w-5 h-5 text-zinc-300" />
              <span className="absolute -top-1.5 -right-1.5 text-base leading-none drop-shadow-md">🇪🇬</span>
            </a>

            <a href={`tel:${portfolioData.personal.contact.phone.ksa}`} className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10" title="Call (KSA)">
              <Phone className="w-5 h-5 text-zinc-300" />
              <span className="absolute -top-1.5 -right-1.5 text-base leading-none drop-shadow-md">🇸🇦</span>
            </a>

            <a href={portfolioData.personal.contact.whatsapp.egypt} target="_blank" rel="noreferrer" className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10" title="WhatsApp (Egypt)">
              <WhatsAppIcon className="w-5 h-5 text-green-400" />
              <span className="absolute -top-1.5 -right-1.5 text-base leading-none drop-shadow-md">🇪🇬</span>
            </a>

            <a href={portfolioData.personal.contact.whatsapp.ksa} target="_blank" rel="noreferrer" className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10" title="WhatsApp (KSA)">
              <WhatsAppIcon className="w-5 h-5 text-green-400" />
              <span className="absolute -top-1.5 -right-1.5 text-base leading-none drop-shadow-md">🇸🇦</span>
            </a>

            <a href={portfolioData.personal.resume} target="_blank" rel="noreferrer" className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10" title="View Resume">
              <FileBadge className="w-5 h-5 text-blue-400" />
            </a>

            <a href={url} target="_blank" rel="noreferrer" className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10" title="Portfolio Website">
              <AppWindow className="w-5 h-5 text-purple-400" />
            </a>
          </div>

          <ButtonWithIcon 
            onClick={handleDownloadVCard} 
            text="Let's Collaborate"
          />
        </GlowCard>
      </div>
    </div>
  );
}
