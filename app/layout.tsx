import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css'; // Global styles
import { ThemeProvider } from '@/components/theme-provider';
import { AIChatWidget } from '@/components/ui/AIChatWidget';
import { ReactLenisProvider } from '@/components/ReactLenisProvider';
import 'lenis/dist/lenis.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'Kareem Safwat | Senior Quantity Surveyor & AI Vibe Coder',
    template: '%s | Kareem Safwat',
  },
  description: 'Portfolio of Kareem Safwat, Senior Quantity Surveyor and AI Vibe Coder specializing in Agentic Software Development. 9+ years of experience in cost management and AI-powered workflows.',
  keywords: [
    'Kareem Safwat',
    'Senior Quantity Surveyor',
    'AI Vibe Coder',
    'Agentic Software Development',
    'Cost Estimation',
    'Tendering',
    'AI Workflows',
    'Full Stack Web Apps',
    'Construction Cost Management',
    'Claude Code',
    'Anthropic API',
  ],
  authors: [{ name: 'Kareem Safwat' }],
  creator: 'Kareem Safwat',
  publisher: 'Kareem Safwat',
  metadataBase: new URL('https://kareemsf.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kareemsf.vercel.app',
    title: 'Kareem Safwat | Senior Quantity Surveyor & AI Vibe Coder',
    description: 'Portfolio of Kareem Safwat, Senior Quantity Surveyor and AI Vibe Coder specializing in Agentic Software Development. 9+ years of experience in cost management and AI-powered workflows.',
    siteName: 'Kareem Safwat Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kareem Safwat Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kareem Safwat | Senior Quantity Surveyor & AI Vibe Coder',
    description: 'Portfolio of Kareem Safwat, Senior Quantity Surveyor and AI Vibe Coder specializing in Agentic Software Development.',
    images: ['/og-image.png'],
    creator: '@Sf_Kareem',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    other: {},
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Kareem Safwat",
    url: "https://kareemsf.vercel.app",
    jobTitle: ["Senior Quantity Surveyor", "AI Vibe Coder"],
    description: "Senior Quantity Surveyor with 9+ years of experience in cost estimation, tendering, and procurement. Also an AI Vibe Coder building intelligent full-stack applications with Claude and agentic workflows.",
    sameAs: [
      "https://linkedin.com/in/kareemsafwat/",
      "https://x.com/Sf_Kareem",
    ],
    knowsAbout: [
      "Quantity Surveying",
      "Cost Estimation",
      "Tendering",
      "Procurement",
      "AI Development",
      "Full Stack Web Development",
      "Agentic Software Development",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased selection:bg-primary/30 selection:text-primary">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md">
          Skip to main content
        </a>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.72/build/spline-viewer.js" strategy="lazyOnload" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactLenisProvider>
            <div id="main-content">
              {children}
            </div>
          </ReactLenisProvider>
          <AIChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
