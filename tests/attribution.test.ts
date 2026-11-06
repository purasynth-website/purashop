import { afterEach, describe, expect, it, vi } from "vitest";
import { captureAttribution, captureFromRequest, readAttribution, sourceFromReferrer, sourceFromUserAgent } from "@/lib/attribution";
import { SPECIAL20_OFFER, buildClaimUrl } from "@/lib/offer";

describe("sourceFromReferrer", () => {
  it("maps the in-app browser referrers to their platform", () => {
    expect(sourceFromReferrer("https://l.instagram.com/")).toBe("instagram");
    expect(sourceFromReferrer("https://www.instagram.com/purasynth/")).toBe("instagram");
    expect(sourceFromReferrer("android-app://com.instagram.android")).toBe("instagram");
    expect(sourceFromReferrer("https://l.facebook.com/l.php?u=x")).toBe("facebook");
    expect(sourceFromReferrer("android-app://com.facebook.katana")).toBe("facebook");
    expect(sourceFromReferrer("https://www.tiktok.com/@purasynth")).toBe("tiktok");
    expect(sourceFromReferrer("android-app://com.zhiliaoapp.musically")).toBe("tiktok");
    expect(sourceFromReferrer("https://t.co/abc")).toBe("x");
    expect(sourceFromReferrer("https://m.youtube.com/")).toBe("youtube");
  });

  it("returns nothing for unknown, empty or malformed referrers", () => {
    expect(sourceFromReferrer("")).toBeNull();
    expect(sourceFromReferrer("https://www.google.com/")).toBeNull();
    expect(sourceFromReferrer("https://purasynth.shop/")).toBeNull();
    expect(sourceFromReferrer("not a url")).toBeNull();
    expect(sourceFromReferrer("https://notinstagram.com/")).toBeNull();
  });
});

describe("sourceFromUserAgent — the app whose built-in browser is showing the page", () => {
  const IOS = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";

  it("recognises Instagram, Facebook and TikTok", () => {
    expect(sourceFromUserAgent(`${IOS} Instagram 339.0.0.12.91 (iPhone14,5; iOS 17_5; en_US)`)).toBe("instagram");
    expect(sourceFromUserAgent(`${IOS} [FBAN/FBIOS;FBAV/470.0.0.37.109;FBBV/612345678]`)).toBe("facebook");
    expect(
      sourceFromUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/124.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/470.0.0.0;]"),
    ).toBe("facebook");
    expect(sourceFromUserAgent(`${IOS} musical_ly_34.1.0 JsSdk/2.0 NetType/WIFI Region/US BytedanceWebview/d8a21c6`)).toBe("tiktok");
  });

  it("reads Instagram as Instagram even when its user agent also carries Facebook's markers", () => {
    expect(sourceFromUserAgent(`${IOS} [FBAN/FBIOS;FBAV/470.0.0.37.109] Instagram 339.0.0.12.91`)).toBe("instagram");
  });

  it("says nothing about an ordinary browser", () => {
    expect(sourceFromUserAgent(`${IOS} Version/17.5 Mobile/15E148 Safari/604.1`)).toBeNull();
    expect(sourceFromUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36")).toBeNull();
    expect(sourceFromUserAgent("")).toBeNull();
    expect(sourceFromUserAgent(null)).toBeNull();
  });
});

describe("captureAttribution → the claim link", () => {
  const INSTAGRAM = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Instagram 339.0.0.12.91";
  const SAFARI = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1";

  function visit(opts: { search?: string; referrer?: string; ua?: string; storage?: "ok" | "blocked"; store?: Record<string, string> }) {
    const store = opts.store ?? {};
    const sessionStorage =
      opts.storage === "blocked"
        ? {
            getItem: () => {
              throw new Error("blocked");
            },
            setItem: () => {
              throw new Error("blocked");
            },
          }
        : { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => void (store[k] = v) };
    vi.stubGlobal("window", { location: { search: opts.search ?? "" }, sessionStorage, navigator: { userAgent: opts.ua ?? SAFARI } });
    vi.stubGlobal("document", { referrer: opts.referrer ?? "" });
    captureAttribution();
    return new URL(buildClaimUrl(SPECIAL20_OFFER, readAttribution()));
  }

  afterEach(() => vi.unstubAllGlobals());

  it("an ad opened inside Instagram with NOTHING on the link still reaches the store as instagram", () => {
    const url = visit({ ua: INSTAGRAM });
    expect(url.searchParams.get("utm_source")).toBe("instagram");
    expect(url.searchParams.get("promo")).toBe("SPECIAL25");
    expect(url.searchParams.get("utm_medium")).toBe("offer-page");
  });

  it("a click id or a campaign tag on the link always outranks the user agent", () => {
    const tagged = visit({ search: "?utm_source=facebook&utm_medium=paid&fbclid=FB1", ua: INSTAGRAM });
    expect(tagged.searchParams.get("utm_source")).toBe("facebook");
    expect(tagged.searchParams.get("fbclid")).toBe("FB1");
    const clickOnly = visit({ search: "?ttclid=T1", ua: INSTAGRAM });
    expect(clickOnly.searchParams.get("ttclid")).toBe("T1");
    expect(clickOnly.searchParams.get("utm_source")).toBe("purasynth.shop"); // not guessed from the app
  });

  it("a referrer outranks the user agent; an ordinary browser with no signal stays this page", () => {
    expect(visit({ referrer: "https://www.tiktok.com/@purasynth", ua: INSTAGRAM }).searchParams.get("utm_source")).toBe("tiktok");
    expect(visit({ ua: SAFARI }).searchParams.get("utm_source")).toBe("purasynth.shop");
  });

  it("still forwards the source when the browser refuses sessionStorage", () => {
    const url = visit({ search: "?fbclid=FB2", ua: INSTAGRAM, storage: "blocked" });
    expect(url.searchParams.get("fbclid")).toBe("FB2");
  });

  it("a later page view with no signal keeps what the landing stored", () => {
    const store: Record<string, string> = {};
    visit({ search: "?fbclid=FB3", store });
    const url = visit({ search: "", store });
    expect(url.searchParams.get("fbclid")).toBe("FB3");
  });
});

describe("captureFromRequest — the same capture, done on the server while rendering", () => {
  const IOS = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
  const INSTAGRAM = `${IOS} Instagram 339.0.0.12.91 (iPhone14,5; iOS 17_5; en_US)`;
  const SAFARI = `${IOS} Version/17.5 Safari/604.1`;

  it("forwards the campaign tags and click ids the ad link carried", () => {
    expect(
      captureFromRequest({ utm_source: "facebook", utm_medium: "paid", fbclid: "FB1", ttclid: "TT1" }),
    ).toEqual({ utm_source: "facebook", utm_medium: "paid", fbclid: "FB1", ttclid: "TT1" });
  });

  it("ignores anything that is not a forwarded parameter", () => {
    expect(captureFromRequest({ promo: "SPECIAL20", ref: "X", utm_source: "tiktok" })).toEqual({
      utm_source: "tiktok",
    });
  });

  it("takes the first of a repeated parameter, as URLSearchParams.get would", () => {
    expect(captureFromRequest({ utm_source: ["facebook", "tiktok"] })).toEqual({ utm_source: "facebook" });
  });

  it("names the platform from the referer header when the link carried no tag", () => {
    expect(captureFromRequest({}, "https://l.instagram.com/").utm_source).toBe("instagram");
    expect(captureFromRequest({}, "android-app://com.zhiliaoapp.musically").utm_source).toBe("tiktok");
  });

  it("falls back to the app in the user agent when there is no tag and no referer", () => {
    expect(captureFromRequest({}, null, INSTAGRAM).utm_source).toBe("instagram");
    expect(captureFromRequest({}, "", INSTAGRAM).utm_source).toBe("instagram");
  });

  it("keeps the precedence the client uses: tag, then referer, then user agent", () => {
    expect(captureFromRequest({ utm_source: "facebook" }, "https://www.tiktok.com/@x", INSTAGRAM).utm_source).toBe(
      "facebook",
    );
    expect(captureFromRequest({}, "https://www.tiktok.com/@x", INSTAGRAM).utm_source).toBe("tiktok");
    expect(captureFromRequest({ ttclid: "T1" }, null, INSTAGRAM)).toEqual({ ttclid: "T1" });
  });

  it("captures nothing from an ordinary browser that arrived with no signal", () => {
    expect(captureFromRequest({}, null, SAFARI)).toEqual({});
    expect(captureFromRequest({})).toEqual({});
  });

  it("truncates an absurdly long value rather than forwarding it whole", () => {
    expect(captureFromRequest({ fbclid: "z".repeat(400) }).fbclid).toHaveLength(256);
  });

  it("puts the platform into the claim link in the SERVER-RENDERED html", () => {
    const url = new URL(buildClaimUrl(SPECIAL20_OFFER, captureFromRequest({}, null, INSTAGRAM), { live: true }));
    expect(url.searchParams.get("utm_source")).toBe("instagram");
    expect(url.searchParams.get("promo")).toBe("SPECIAL25");

    const clicked = new URL(buildClaimUrl(SPECIAL20_OFFER, captureFromRequest({ fbclid: "FB9" }, null, INSTAGRAM), { live: true }));
    expect(clicked.searchParams.get("fbclid")).toBe("FB9");
    expect(clicked.searchParams.get("utm_source")).toBe("purasynth.shop");

    const bare = new URL(buildClaimUrl(SPECIAL20_OFFER, captureFromRequest({}, null, SAFARI), { live: true }));
    expect(bare.searchParams.get("utm_source")).toBe("purasynth.shop");
  });

  it("a client with nothing stored cannot downgrade the link the server built", () => {
    const captured = captureFromRequest({ utm_source: "facebook", fbclid: "FB1" });
    const merged = new URL(buildClaimUrl(SPECIAL20_OFFER, { ...captured, ...{} }, { live: true }));
    expect(merged.searchParams.get("utm_source")).toBe("facebook");
    expect(merged.searchParams.get("fbclid")).toBe("FB1");
  });
});
