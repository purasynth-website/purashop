import { describe, expect, it } from "vitest";
import {
  BRIDGE_SOURCE,
  SPECIAL20_OFFER,
  STORE_ORIGIN,
  buildClaimUrl,
  isOfferLive,
  liveOffer,
  offerCampaign,
  offerEndsLabel,
  type Offer,
} from "@/lib/offer";

const offer = SPECIAL20_OFFER as Offer & { code: string };

describe("buildClaimUrl — SPECIAL20", () => {
  it("sends the visitor to the store with the code the landing capture reads", () => {
    const url = new URL(buildClaimUrl(offer));
    expect(url.origin).toBe(STORE_ORIGIN);
    expect(url.pathname).toBe(offer.destinationPath);
    expect(url.searchParams.get("promo")).toBe("SPECIAL20");
    expect(offer.code).toMatch(/^[A-Z0-9_-]{1,40}$/);
  });

  it("names this page as the source when the visitor arrived bare", () => {
    const url = new URL(buildClaimUrl(offer));
    expect(BRIDGE_SOURCE).toBe("purasynth.shop");
    expect(url.searchParams.get("utm_source")).toBe("purasynth.shop");
    expect(url.searchParams.get("utm_medium")).toBe("offer-page");
    expect(url.searchParams.get("utm_campaign")).toBe("special20");
  });

  it("lets the visitor's own campaign tags win and forwards ad click ids", () => {
    const url = new URL(
      buildClaimUrl(offer, { utm_source: "instagram", utm_medium: "bio", fbclid: "abc123", gclid: "g-1" }),
    );
    expect(url.searchParams.get("utm_source")).toBe("instagram");
    expect(url.searchParams.get("utm_medium")).toBe("bio");
    expect(url.searchParams.get("utm_campaign")).toBe("special20");
    expect(url.searchParams.get("fbclid")).toBe("abc123");
    expect(url.searchParams.get("gclid")).toBe("g-1");
    expect(url.searchParams.get("promo")).toBe("SPECIAL20");
  });

  it("ignores empty values and encodes safely", () => {
    const url = new URL(buildClaimUrl(offer, { ttclid: "", utm_content: "a b&c" }));
    expect(url.searchParams.has("ttclid")).toBe(false);
    expect(url.searchParams.get("utm_content")).toBe("a b&c");
  });

  it("carries no code once the offer has ended", () => {
    const url = new URL(buildClaimUrl(offer, { fbclid: "abc" }, { live: false }));
    expect(url.searchParams.has("promo")).toBe(false);
    expect(url.searchParams.get("utm_campaign")).toBe("offer-ended");
    expect(url.searchParams.get("fbclid")).toBe("abc");
  });
});

describe("the November Sale offer", () => {
  it("is what the page hands out", () => {
    expect(liveOffer()).toBe(SPECIAL20_OFFER);
  });

  it("names both halves of the deal and the gate", () => {
    expect(offer.percent).toBe(20);
    expect(offer.subheadline).toBe("20% off + Buy 2, Get 1 Free");
    expect(offer.bonus).toContain("$50 or more");
    expect(offer.bonus).toContain("$49.99 or under");
    expect(offer.bonus).toContain("up to 3 per order");
    expect(offer.blurb).toContain("Recon Water");
    expect(offerCampaign(offer)).toBe("special20");
  });

  it("ends with the store's sale: Nov 8 2026, 11:59:59 PM Pacific", () => {
    expect(offer.endsAt).toBe(Date.UTC(2026, 10, 9, 7, 59, 59));
    expect(offerEndsLabel(offer)).toBe("November 8");
    expect(isOfferLive(offer, Date.UTC(2026, 10, 9, 7, 59, 59))).toBe(true);
    expect(isOfferLive(offer, Date.UTC(2026, 10, 9, 8, 0, 0))).toBe(false);
  });

  it("is live today while the sale runs", () => {
    expect(isOfferLive(offer, Date.UTC(2026, 10, 4, 12, 0, 0))).toBe(true);
  });
});
