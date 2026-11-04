import { describe, expect, it } from "vitest";
import { ARTICLES, articlePath, formatDate, getArticle, padNumber } from "@/lib/blog";

describe("the primer index", () => {
  it("has unique kebab-case slugs, a dek for each entry, and numbers 1..n in order", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    ARTICLES.forEach((a, i) => {
      expect(a.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(a.dek.length).toBeGreaterThan(60);
      expect(a.readMinutes).toBeGreaterThan(0);
      expect(a.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.number).toBe(i + 1);
    });
  });

  it("finds a primer by slug and nothing for an unknown one", () => {
    expect(getArticle("two-masses-one-molecule")?.topic).toBe("Mass & formula");
    expect(getArticle("nope")).toBeUndefined();
    expect(articlePath("two-masses-one-molecule")).toBe("/primers/two-masses-one-molecule");
  });

  it("formats dates and numbers the way the pages print them", () => {
    expect(formatDate("2026-10-20")).toBe("20 Oct 2026");
    expect(formatDate("2026-10-06")).toBe("6 Oct 2026");
    expect(padNumber(4)).toBe("04");
    expect(padNumber(12)).toBe("12");
  });

  it("every primer has a body and every body has a primer", async () => {
    const { ARTICLE_BODIES } = await import("@/lib/articles");
    const slugs = ARTICLES.map((a) => a.slug).sort();
    expect(Object.keys(ARTICLE_BODIES).sort()).toEqual(slugs);
  });
});
