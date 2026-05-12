const CIVIL_YEARS = new Date().getFullYear() - 2017; // 9 (2026 - 2017)
const AI_YEARS = new Date().getFullYear() - 2023; // 3 (2026 - 2023)

export const personal = {
  name: "Kareem Safwat",
  title: "Senior Quantity Surveyor / AI Vibe Coder",
  tagline: "Constructing Value & Control",
  summary: `Senior Quantity Surveyor with ${CIVIL_YEARS}+ years of experience (since 2017 graduation). RICS APC Candidate. Expert in tendering, procurement, and strategic cost management. Also an AI Vibe Coder and Agentic Software Developer leveraging Anthropic's Claude to automate complex workflows and build scalable full-stack web applications.`,
  resume: "https://1drv.ms/b/c/3ef89486fb4c3d1e/Ea1q4HK2lSNAg9JO-dxQHDoBT6CxmOV6giXxdlq9YNRKOg?e=m6m6ZY",
};

export const projects = [
  {
    name: "Controls Academy",
    url: "https://controlsacademy.net/",
    description: "A comprehensive educational platform built from the ground up, featuring AI-powered workflows and automated technical training systems.",
    technologies: ["React", "Next.js", "AI Vibe Coding", "Agentic Software Development"],
  },
];

export const skills = {
  tools: ["Claude Code", "Anthropic API", "Cursor"],
  technicalSkills: [
    "AI Vibe Coding",
    "Agentic Software Development",
    "Prompt Engineering",
    "AI Workflow Automation",
    "Full Stack Web Apps",
    "Scalable Full-Stack Applications",
  ],
  specializations: ["AI & Vibe Coding"],
};

export const certifications = [
  { name: "Claude Code in Action", issuer: "Anthropic", date: "2026" },
  { name: "Claude 101: Professional AI Workflow Certification", issuer: "Anthropic", date: "2026" },
  { name: "AI Fluency: Framework & Foundations", issuer: "Anthropic", date: "2026" },
  { name: "Claude with the Anthropic API", issuer: "Anthropic", date: "2026" },
];

export const contact = {
  email: "kareemsf1995@gmail.com",
  phone: { egypt: "+20 101 817 1342", ksa: "+966 53 726 2745" },
  linkedin: "https://linkedin.com/in/kareemsafwat/",
  twitter: "https://x.com/Sf_Kareem",
  status: "Available for Work",
};

export const TAB_LABELS = ['whoami', 'repos', '~/stack', 'certs', './reach', './agent'] as const;

export type TabId = typeof TAB_LABELS[number];

export function getTabContent(tab: TabId): string {
  switch (tab) {
    case "whoami":
      return [
        `Name:       ${personal.name}`,
        `Title:      ${personal.title}`,
        `Tagline:    ${personal.tagline}`,
        `Experience: ${CIVIL_YEARS}+ years (Civil) · ${AI_YEARS}+ years (AI)`,
        `Resume:     ${personal.resume}`,
        `─`.repeat(48),
        ``,
        personal.summary,
      ].join("\n");

    case "repos":
      return projects
        .map(
          (p) =>
            [
              p.name,
              `URL:  ${p.url}`,
              `Tech: ${p.technologies.join(", ")}`,
              `─`.repeat(48),
              ``,
              p.description,
            ].join("\n")
        )
        .join("\n\n");

    case "~/stack":
      return [
        `TOOLS`,
        ...skills.tools.map((t) => `  ${t}`),
        ``,
        `TECHNICAL SKILLS`,
        ...skills.technicalSkills.map((s) => `  ${s}`),
        ``,
        `SPECIALIZATIONS`,
        ...skills.specializations.map((s) => `  ${s}`),
      ].join("\n");

    case "certs":
      return certifications
        .map((c, i) => `${i + 1}. ${c.name.padEnd(50)} [${c.issuer} · ${c.date}]`)
        .join("\n");

    case "./reach":
      return [
        `Email:    ${contact.email}`,
        `Phone:    ${contact.phone.egypt} (EG) / ${contact.phone.ksa} (KSA)`,
        `LinkedIn: ${contact.linkedin}`,
        `X:        ${contact.twitter}`,
        `─`.repeat(48),
        ``,
        `Status:   ${contact.status}`,
      ].join("\n");

    case "./agent":
      return ""; // handled by TerminalChat
  }
}
