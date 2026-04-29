import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Civil Engineering | Quantity Surveying & Cost Estimation - Kareem Safwat',
  description: 'Explore the Civil Engineering portfolio of Kareem Safwat, Senior Quantity Surveyor with 9+ years of experience in cost estimation, tendering, procurement, and contract administration.',
  keywords: [
    'Quantity Surveying',
    'Cost Estimation',
    'Tendering',
    'Procurement',
    'Contract Administration',
    'Kareem Safwat',
    'Civil Engineering',
    'Construction Cost Management',
    'CCS Candy',
    'FIDIC',
  ],
  openGraph: {
    title: 'Civil Engineering | Quantity Surveying & Cost Estimation - Kareem Safwat',
    description: 'Senior Quantity Surveyor with 9+ years of experience. Expert in tendering, procurement, and strategic cost management.',
    type: 'website',
    url: 'https://kareemsf.vercel.app/civil',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Engineering | Quantity Surveying & Cost Estimation - Kareem Safwat',
    description: 'Senior Quantity Surveyor with 9+ years of experience.',
  },
};

export default function CivilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kareem Safwat",
    "jobTitle": "Senior Quantity Surveyor",
    "url": "https://kareemsf.vercel.app/civil",
    "knowsAbout": [
      "Quantity Surveying",
      "Cost Estimation",
      "Tendering",
      "Procurement",
      "Contract Administration",
      "CCS Candy",
      "FIDIC",
      "Green Building"
    ],
    "description": "Professional portfolio of Kareem Safwat, a Senior Quantity Surveyor with 9+ years of experience in cost estimation, tendering, and procurement."
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
