import { describe, expect, it } from "vitest";
import { ARTICLES, formatDate, getArticle } from "@/lib/blog";

describe("the explainer index", () => {
  it("has unique kebab-case slugs and a body-sized summary for each entry", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const a of ARTICLES) {
      expect(a.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(a.summary.length).toBeGreaterThan(60);
      expect(a.readMinutes).toBeGreaterThan(0);
      expect(a.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("finds an article by slug and nothing for an unknown one", () => {
    expect(getArticle("average-exact-and-monoisotopic-mass")?.category).toBe("Molecular mass");
    expect(getArticle("nope")).toBeUndefined();
  });

  it("formats dates the way the masthead prints them", () => {
    expect(formatDate("2026-10-20")).toBe("20 Oct 2026");
    expect(formatDate("2026-10-06")).toBe("6 Oct 2026");
  });

  it("every article has a body and every body has an article", async () => {
    const { ARTICLE_BODIES } = await import("@/lib/articles");
    const slugs = ARTICLES.map((a) => a.slug).sort();
    expect(Object.keys(ARTICLE_BODIES).sort()).toEqual(slugs);
  });
});
