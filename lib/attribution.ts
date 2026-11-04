import { FORWARDED_PARAMS, type Captured } from "@/lib/offer";

/**
 * Remembers the campaign tags / ad click ids the visitor landed with so the
 * claim button can hand them to the store. sessionStorage, not a cookie: it
 * dies with the tab, is never sent anywhere by itself, and needs no consent
 * banner. Last touch wins, the same rule the store applies: a visit that
 * carries any signal replaces what was stored, a visit with none keeps it.
 */
const KEY = "ps_offer_attribution";

const CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid", "ttclid", "msclkid"] as const;

/**
 * Which platform a referrer belongs to, for a visit that arrived with no
 * campaign tags. A bio-link tap from the Instagram in-app browser sends
 * l.instagram.com (iOS) or android-app://com.instagram.android as the
 * referrer and nothing else, and that referrer dies at the next hop, so it has
 * to be turned into a utm_source here or the store files the order under this
 * domain instead of Meta.
 */
const REFERRER_SOURCES: Array<[RegExp, string]> = [
  [/(^|\.)instagram\.com$|^com\.instagram\./, "instagram"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.com$|^com\.facebook\./, "facebook"],
  [/(^|\.)tiktok\.com$|^com\.zhiliaoapp\.|^com\.ss\.android\.ugc\./, "tiktok"],
  [/(^|\.)youtube\.com$|^youtu\.be$|^com\.google\.android\.youtube$/, "youtube"],
  [/(^|\.)x\.com$|(^|\.)twitter\.com$|^t\.co$|^com\.twitter\./, "x"],
];

export function sourceFromReferrer(referrer: string): string | null {
  if (!referrer) return null;
  let host: string;
  try {
    host = new URL(referrer).host.toLowerCase();
  } catch {
    return null;
  }
  for (const [pattern, source] of REFERRER_SOURCES) {
    if (pattern.test(host)) return source;
  }
  return null;
}

/**
 * Which app's built-in browser is showing the page, from the user agent.
 *
 * Measured on the store 2026-09-18: of 9 real shoppers who came through this page
 * and reached checkout, NONE arrived with a click id, a campaign tag or a usable
 * referrer — an ad tapped inside Instagram, Facebook or TikTok opens in that
 * app's own browser and often hands over nothing at all. Every one of those
 * orders was filed under this domain instead of the platform that paid for the
 * click. The app still names itself in the user agent, and that is the one
 * signal left. Consulted LAST, only when nothing else says where the visitor
 * came from. Instagram first: its user agent can also carry Facebook's markers.
 */
const APP_SOURCES: Array<[RegExp, string]> = [
  [/Instagram/i, "instagram"],
  [/\b(FBAN|FBAV|FB_IAB|FBIOS)\b/, "facebook"],
  [/BytedanceWebview|musical_ly|\bTikTok\b|trill_/i, "tiktok"],
];

export function sourceFromUserAgent(ua: string | null | undefined): string | null {
  if (!ua) return null;
  for (const [pattern, source] of APP_SOURCES) {
    if (pattern.test(ua)) return source;
  }
  return null;
}

/**
 * The same capture, done on the SERVER while rendering the page.
 *
 * Why it has to exist: the claim link is baked into the HTML, and until this
 * function was added it was baked in bare — `buildClaimUrl({})` — because the
 * page could not see the request. The real tags were only patched in by the
 * effect in offer-card.tsx once React had hydrated, measured at 62-69 ms on a
 * desktop and longer inside an in-app browser on a phone. Anything that left
 * the page inside that window — a fast tap, a long-press, "open in browser",
 * JavaScript disabled — shipped the bare link, and the store filed the visit
 * under this domain instead of Meta or TikTok (20 such landings, 2026-09-16
 * to 09-20, on a page whose entire job is a fast tap-through).
 *
 * The request carries everything the browser does and more: the query string,
 * the `referer` header (which survives even where `document.referrer` does
 * not) and the user agent. So the HTML now leaves the server already correct,
 * and the client effect is only a backstop for a second page view in the same
 * tab. Same precedence as captureAttribution: an explicit tag or click id
 * first, then the referrer, then the app named in the user agent.
 */
export function captureFromRequest(
  query: Record<string, string | string[] | undefined>,
  referer?: string | null,
  userAgent?: string | null,
): Captured {
  const next: Captured = {};
  for (const key of FORWARDED_PARAMS) {
    const raw = query[key];
    // `?utm_source=a&utm_source=b` arrives as an array; the first wins, as it
    // would in URLSearchParams.get().
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (typeof value === "string" && value) next[key] = value.slice(0, 256);
  }
  const hasSource = !!next.utm_source || CLICK_IDS.some((k) => !!next[k]);
  if (!hasSource) {
    const source = sourceFromReferrer(referer ?? "") ?? sourceFromUserAgent(userAgent);
    if (source) next.utm_source = source;
  }
  return next;
}

/** Same page view only: what was captured, for browsers that refuse sessionStorage. */
let memory: Captured = {};

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const next: Captured = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of FORWARDED_PARAMS) {
      const value = params.get(key);
      if (value) next[key] = value.slice(0, 256);
    }
    const hasSource = !!next.utm_source || CLICK_IDS.some((k) => !!next[k]);
    if (!hasSource) {
      const source =
        sourceFromReferrer(typeof document === "undefined" ? "" : document.referrer) ??
        sourceFromUserAgent(window.navigator?.userAgent);
      if (source) next.utm_source = source;
    }
  } catch {
    /* a malformed URL must not stop the rest */
  }
  if (Object.keys(next).length === 0) return; // no signal: keep whatever an earlier landing stored
  memory = next;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode or storage disabled: the in-memory copy still serves this page view */
  }
}

export function readAttribution(): Captured {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Captured) : {};
  } catch {
    // Storage refused outright: serve what this page view captured.
    return memory;
  }
}
