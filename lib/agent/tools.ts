import portfolioData from "@/data/portfolio.json";

export function getPortfolioOverview() {
  const { personal, statistics } = portfolioData;
  return {
    name: personal.name,
    title: personal.title,
    tagline: personal.tagline,
    summary: personal.summary,
    professionalStatement: personal.professionalStatement,
    statistics,
  };
}

export function getExperience() {
  return portfolioData.experience;
}

export function getSkills() {
  return portfolioData.expertise;
}

export function getCertificationsByCategory(category?: "civil" | "ai") {
  if (!category) return portfolioData.certifications;
  return portfolioData.certifications.filter((c) => c.category === category);
}

export function getProjects() {
  return portfolioData.projects ?? [];
}

export function getContactInfo() {
  const { contact } = portfolioData.personal;
  return {
    email: contact.email,
    linkedin: contact.linkedin,
    twitter: contact.twitter,
    phone: contact.phone,
    whatsapp: contact.whatsapp,
  };
}

export function searchPortfolio(query: string) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase();
  const results: { section: string; match: string }[] = [];

  const searchObject = (obj: Record<string, unknown>, section: string) => {
    for (const value of Object.values(obj)) {
      if (typeof value === "string" && value.toLowerCase().includes(q)) {
        results.push({ section, match: value });
      } else if (typeof value === "object" && value !== null) {
        searchObject(value as Record<string, unknown>, section);
      }
    }
  };

  searchObject(portfolioData as unknown as Record<string, unknown>, "portfolio");
  return results;
}
