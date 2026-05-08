import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "../prompt";

describe("buildSystemPrompt", () => {
  it("returns a string", () => {
    const prompt = buildSystemPrompt();
    expect(typeof prompt).toBe("string");
  });

  it("contains Kareem's name", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("Kareem");
  });

  it("instructs to use tools", () => {
    const prompt = buildSystemPrompt();
    expect(prompt.toLowerCase()).toContain("tool");
  });
});
