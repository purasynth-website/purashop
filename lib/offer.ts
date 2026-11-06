/**
 * The offer this site hands out, and where "Claim" sends people.
 *
 * Everything customer-facing about the deal lives here so changing a code, a
 * percentage or an end date is a one-file edit. A code MUST be an active code
 * in the store's discount table; the store validates it server-side at
 * checkout, this site never does. An offer the store applies on its own (a
 * free vial added in the cart) can have no code at all: nothing to copy,
 * nothing on the link, and the page says so.
 *
 * Which offer the page serves is decided by liveOffer() at the bottom of this
 * file — the go-live switch, evaluated on every request.
 */
export const STORE_ORIGIN = "https://purasynth.com";

/**
 * utm_source on the claim link when the visitor arrived with no tag of their
 * own: names this page, so the store can tell a bridge visit from a bare
 * referral. Keep it the bare hostname — the store matches on it.
 */
export const BRIDGE_SOURCE = "purasynth.shop";

type OfferCopy = {
  /**
   * When the deal stops on the store, as a UTC timestamp, or null for an
   * open-ended offer. Past it the page renders OFFER_ENDED and links without
   * a code, so nobody is promised a discount the store will refuse.
   */
  endsAt: number | null;
  /**
   * The IANA zone the end is quoted in by offerEndsLabel ("November 8"); omit
   * for US Central. A deal that ends at midnight Pacific must say so, or
   * Central prints the next day.
   */
  endsAtZone?: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  /** Second perk, shown under the headline. */
  bonus: string;
  blurb: string;
  cta: string;
  /** Where the button lands on the store. */
  destinationPath: string;
};

export type Offer = OfferCopy &
  (
    | {
        /** The promo code the page shows, copies and puts on the link as ?promo=. */
        code: string;
        /** Percent off the code gives. */
        percent: number;
        /** utm_campaign on the claim link; defaults to the code, lower-cased. */
        campaign?: string;
      }
    | {
        /**
         * No code: the store applies the deal by itself. The page shows no
         * code box and the link carries no ?promo=.
         */
        code: null;
        /** Nothing to print: a codeless offer has no percentage. */
        percent: 0;
        /** utm_campaign on the claim link — a slug naming the offer. */
        campaign: string;
      }
  );

/**
 * The store's November Sale (owner, 2026-11-02): code SPECIAL20 — 20% off —
 * raised on 2026-11-06 to code SPECIAL25, 25% off (the internal name stays) —
 * sitewide, stacking in full with Buy 2, Get 1 Free: every two single vials
 * (one of them above $49.99 — $50 or more) earn a free single vial $49.99 or
 * under, up to 3 free per order; 5/10-packs, stacks and Recon Water aren't
 * included. The window is the store's own (lib/offers/sale.ts there,
 * SPECIAL20_SALE): Nov 3 00:00 to Nov 8 11:59:59 PM Pacific (PST).
 */
export const SPECIAL20_OFFER: Offer = {
  code: "SPECIAL25",
  percent: 25,
  /** Nov 8 2026, 23:59:59 Pacific (PST, UTC-8) — the same instant as SPECIAL20_SALE.endsAt on the store. */
  endsAt: Date.UTC(2026, 10, 9, 7, 59, 59),
  endsAtZone: "America/Los_Angeles",
  eyebrow: "November Sale",
  headline: "Your deal is ready",
  subheadline: "25% off + Buy 2, Get 1 Free",
  bonus: "Add 2 vials (at least one $50 or more) and pick a third vial $49.99 or under, free — up to 3 per order",
  blurb:
    "Copy the code — it applies itself at checkout and stacks in full with the free vial. Packs, stacks and Recon Water aren't included.",
  cta: "Claim 25% off + Buy 2, Get 1 Free",
  destinationPath: "/products",
};

/**
 * ▶ GO-LIVE SWITCH: which offer the page hands out, decided on EVERY request
 * (the page is dynamic), so a dated handover needs no deploy at midnight. The
 * November Sale ends by itself after Nov 8; point this at the next offer when
 * there is one.
 */
export function liveOffer(now: number = Date.now()): Offer {
  void now;
  return SPECIAL20_OFFER;
}

/** What the page says once the offer has ended. */
export const OFFER_ENDED = {
  eyebrow: "Offer ended",
  headline: "This offer has ended",
  subheadline: "Thanks for stopping by",
  blurb: "Head to purasynth.com for current pricing on research-grade peptides and reference materials.",
  cta: "Go to purasynth.com",
} as const;

export function isOfferLive(offer: Offer, now: number = Date.now()): boolean {
  return offer.endsAt === null || now <= offer.endsAt;
}

/** "November 8": the end date in the zone the offer is quoted in (US Central
 *  unless the offer says otherwise) for the fine print, or null when open-ended. */
export function offerEndsLabel(offer: Offer): string | null {
  if (offer.endsAt === null) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: offer.endsAtZone ?? "America/Chicago",
  }).format(offer.endsAt);
}

/** The utm_campaign a live offer's claim link carries: its slug, else its code lower-cased. */
export function offerCampaign(offer: Offer): string {
  return offer.code === null ? offer.campaign : (offer.campaign ?? offer.code.toLowerCase());
}

/**
 * Campaign tags and ad click ids the visitor arrived with. Forwarded to the
 * store so its own attribution sees the original source (Instagram, an ad)
 * rather than a bare referral from this domain.
 */
export const FORWARDED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "ttclid",
  "msclkid",
] as const;

export type ForwardedParam = (typeof FORWARDED_PARAMS)[number];
export type Captured = Partial<Record<ForwardedParam, string>>;

/**
 * Build the store URL the claim button opens.
 *
 * `?promo=CODE` is what the store's landing capture reads (it also accepts
 * ?ref and ?code) and parks for checkout to pre-apply; a codeless offer sends
 * no promo at all, the store applies the deal in the cart. Default campaign
 * tags name this page as the source; anything the visitor actually arrived
 * with overrides them, and ad click ids ride along untouched. Once the offer
 * has ended the link carries no code at all.
 */
export function buildClaimUrl(offer: Offer, captured: Captured = {}, opts: { live?: boolean } = {}): string {
  const live = opts.live ?? true;
  const url = new URL(offer.destinationPath, STORE_ORIGIN);
  if (live && offer.code !== null) url.searchParams.set("promo", offer.code);
  url.searchParams.set("utm_source", BRIDGE_SOURCE);
  url.searchParams.set("utm_medium", "offer-page");
  url.searchParams.set("utm_campaign", live ? offerCampaign(offer) : "offer-ended");
  for (const key of FORWARDED_PARAMS) {
    const value = captured[key];
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}
