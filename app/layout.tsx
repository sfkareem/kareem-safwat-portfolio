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
  title: 'Kareem Safwat | Senior Quantity Surveyor & AI Vibe Coder',
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
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased selection:bg-primary/30 selection:text-primary">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md">
          Skip to main content
        </a>
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
