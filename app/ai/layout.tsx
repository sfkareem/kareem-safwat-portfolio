import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Vibe Coder | Agentic Software Development - Kareem Safwat',
  description: 'Explore the AI portfolio of Kareem Safwat, specializing in AI Vibe Coding, Agentic Software Development, and AI-powered full-stack web applications.',
  keywords: [
    'AI Vibe Coding',
    'Agentic Software Development',
    'AI Workflows',
    'Full Stack Web Apps',
    'Kareem Safwat',
    'AI Portfolio',
    'AI Automation',
    'Generative AI',
  ],
  openGraph: {
    title: 'AI Vibe Coder | Agentic Software Development - Kareem Safwat',
    description: 'Expert in AI Vibe Coding and Agentic Software Development. Building the future of AI-powered applications.',
    type: 'website',
    url: 'https://kareemsf.vercel.app/ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Vibe Coder | Agentic Software Development - Kareem Safwat',
    description: 'Expert in AI Vibe Coding and Agentic Software Development.',
  },
};

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kareem Safwat",
    "jobTitle": "AI Vibe Coder & Senior Quantity Surveyor",
    "url": "https://kareemsf.vercel.app/ai",
    "knowsAbout": [
      "AI Vibe Coding",
      "Agentic Software Development",
      "Full Stack Web Apps",
      "AI Workflows",
      "Generative AI",
      "AI Automation"
    ],
    "description": "Professional portfolio of Kareem Safwat, an expert in AI Vibe Coding and Agentic Software Development."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
