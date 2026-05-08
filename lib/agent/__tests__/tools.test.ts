import { describe, it, expect } from "vitest";
import {
  getPortfolioOverview,
  getExperience,
  getSkills,
  getCertificationsByCategory,
  getProjects,
  getContactInfo,
  searchPortfolio,
} from "../tools";
import portfolioData from "@/data/portfolio.json";

describe("getPortfolioOverview", () => {
  it("returns name, title, tagline, and summary", () => {
    const result = getPortfolioOverview();
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("tagline");
    expect(result).toHaveProperty("summary");
    expect(result.name).toBe(portfolioData.personal.name);
  });
});

describe("getExperience", () => {
  it("returns all experience entries with required fields", () => {
    const result = getExperience();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(portfolioData.experience.length);
    expect(result[0]).toHaveProperty("title");
    expect(result[0]).toHaveProperty("company");
    expect(result[0]).toHaveProperty("startDate");
    expect(result[0]).toHaveProperty("endDate");
  });

  it("returns current role first", () => {
    const result = getExperience();
    expect(result[0].isCurrent).toBe(true);
  });
});

describe("getSkills", () => {
  it("returns both civil and ai expertise", () => {
    const result = getSkills();
    expect(result).toHaveProperty("civil");
    expect(result).toHaveProperty("ai");
    expect(result.civil.tools).toContain("CCS Candy");
    expect(result.ai.tools).toContain("Claude Code");
  });
});

describe("getCertificationsByCategory", () => {
  it("filters certifications by category", () => {
    const civil = getCertificationsByCategory("civil");
    const ai = getCertificationsByCategory("ai");
    expect(civil.every((c) => c.category === "civil")).toBe(true);
    expect(ai.every((c) => c.category === "ai")).toBe(true);
  });

  it("returns all certifications when no category", () => {
    const all = getCertificationsByCategory();
    expect(all.length).toBe(portfolioData.certifications.length);
  });
});

describe("getProjects", () => {
  it("returns projects array", () => {
    const result = getProjects();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("name");
    }
  });
});

describe("getContactInfo", () => {
  it("returns email and social links", () => {
    const result = getContactInfo();
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("linkedin");
    expect(result).toHaveProperty("twitter");
  });
});

describe("searchPortfolio", () => {
  it("finds matching entries by keyword", () => {
    const result = searchPortfolio("CCS Candy");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns empty array for no match", () => {
    const result = searchPortfolio("xyznonexistent123");
    expect(result).toEqual([]);
  });

  it("is case insensitive", () => {
    const lower = searchPortfolio("claude code");
    const upper = searchPortfolio("CLAUDE CODE");
    expect(lower.length).toBeGreaterThan(0);
    expect(lower.length).toBe(upper.length);
  });
});
