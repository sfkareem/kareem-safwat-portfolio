import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

const defaultSEO = {
  title: "Kareem Safwat | Senior Quantity Surveyor & AI Vibe Coder",
  description: "Senior Quantity Surveyor with 9+ years of experience in cost estimation, tendering, and procurement. Also an AI Vibe Coder building intelligent full-stack applications with Claude and agentic workflows.",
  image: "/og-image.png",
  url: "https://kareemsf.vercel.app",
};

export function generateMetadata({
  title = defaultSEO.title,
  description = defaultSEO.description,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = "website",
}: SEOProps): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(defaultSEO.url),
    openGraph: {
      title,
      description,
      type,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "Kareem Safwat Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@Sf_Kareem",
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateJsonLd(type: "person" | "organization" = "person") {
  if (type === "person") {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Kareem Safwat",
      url: defaultSEO.url,
      jobTitle: ["Senior Quantity Surveyor", "AI Vibe Coder"],
      description: defaultSEO.description,
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
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kareem Safwat Portfolio",
    url: defaultSEO.url,
  };
}
