import { afterEach, describe, expect, it, vi } from "vitest";
import { SITE_DOMAIN, SITE_URL, absoluteUrl, pageMeta } from "@/lib/site";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("site config", () => {
  it("falls back to the live https origin", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
    expect(SITE_URL.endsWith("/")).toBe(false);
    expect(SITE_DOMAIN).toBe(new URL(SITE_URL).host);
  });

  it("builds absolute URLs and leaves absolute ones alone", () => {
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/`);
    expect(absoluteUrl("about")).toBe(`${SITE_URL}/about`);
    expect(absoluteUrl("https://example.com/x.png")).toBe("https://example.com/x.png");
  });

  it("uses a well-formed https NEXT_PUBLIC_SITE_URL and ignores a broken one", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com/");
    vi.resetModules();
    const good = await import("@/lib/site");
    expect(good.SITE_URL).toBe("https://preview.example.com");
    expect(good.SITE_DOMAIN).toBe("preview.example.com");

    for (const bad of ["https://", "https://purasynth shop", "http://purasynth.shop"]) {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", bad);
      vi.resetModules();
      const mod = await import("@/lib/site");
      expect(mod.SITE_URL).toBe("https://purasynth.shop");
    }
  });

  it("indexes by default and honours noindex for bridge pages", () => {
    const meta = pageMeta({ title: "T", description: "D", path: "/" });
    expect(meta.title).toEqual({ absolute: "T" });
    expect(meta.alternates?.canonical).toBe("/");
    expect(meta.robots).toEqual({ index: true, follow: true });
    const bridge = pageMeta({ title: "T", description: "D", path: "/", noindex: true });
    expect(bridge.robots).toEqual({ index: false, follow: true });
  });
});
