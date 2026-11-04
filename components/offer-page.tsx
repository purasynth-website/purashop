import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { OfferCard } from "@/components/offer-card";
import { RuoBanner } from "@/components/ruo-banner";
import { captureFromRequest } from "@/lib/attribution";
import { OFFER_ENDED, isOfferLive, offerEndsLabel, type Offer } from "@/lib/offer";
import { ORG_NAME, pageMeta } from "@/lib/site";

/**
 * The offer page. The route file is a thin shell that renders this component
 * with the live offer (lib/offer.ts) and builds its metadata with its own
 * canonical path.
 *
 * Rendered per request, deliberately: reading `searchParams` and `headers()`
 * is what lets the claim link leave the server already carrying the platform
 * the visitor came from (an ad's own tags, or the in-app browser's referrer /
 * user agent), instead of a generic link that JavaScript patches later. The
 * offer's ended state is decided on every request too. The cost is one tiny
 * render per ad click — this page holds no data and no queries.
 */

/** Tints the phone's browser chrome to match the dark page instead of leaving a white band above it. */
export const OFFER_VIEWPORT: Viewport = { themeColor: "#0b1020" };

/** Metadata for the offer route. `path` is the route's own canonical path. */
export function offerMetadata(path: string, offer: Offer): Metadata {
  const live = isOfferLive(offer);
  const deal = offer.code !== null ? offer.subheadline : offer.headline;
  return pageMeta({
    title: live ? `${deal} — ${ORG_NAME}` : `${ORG_NAME} — ${OFFER_ENDED.headline}`,
    description: live
      ? `${offer.headline}: ${offer.subheadline.toLowerCase()} at purasynth.com${
          offer.code !== null ? ` with code ${offer.code}` : ", no code needed"
        }. Research-grade peptides and reference materials, Research Use Only.`
      : `${OFFER_ENDED.blurb} Research Use Only.`,
    path,
    // A coupon bridge page must not compete with the store in search.
    noindex: true,
  });
}

/**
 * The Buy 2, Get 1 mechanic as three tiles — the one "picture" on the page.
 * Plain markup rather than product photography, on purpose: nothing to load,
 * nothing to license, and it reads at a glance inside an in-app browser.
 */
const STEPS = [
  { label: "Vial 1", free: false },
  { label: "Vial 2", free: false },
  { label: "3rd FREE", free: true },
] as const;

const TRUST = [
  {
    title: "Independently tested",
    body: "A certificate of analysis for every batch.",
  },
  {
    title: "Secure checkout",
    body: "Major cards and Apple Pay on purasynth.com.",
  },
  {
    title: "Research Use Only",
    body: "Sold strictly for laboratory research.",
  },
];

/** What Next hands a route's page component. */
export type OfferRouteProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function OfferPage({ offer, searchParams }: OfferRouteProps & { offer: Offer }) {
  const [query, requestHeaders] = await Promise.all([searchParams, headers()]);
  // The `referer` header is the more reliable half of this: several in-app
  // browsers send it while leaving document.referrer empty in the page.
  const captured = captureFromRequest(
    query,
    requestHeaders.get("referer"),
    requestHeaders.get("user-agent"),
  );
  const live = isOfferLive(offer);
  const copy = live ? offer : OFFER_ENDED;

  return (
    <main data-canvas="ink" className="relative flex flex-1 flex-col">
      {/* Backdrop: the brand navy with two soft glows and a faint dot grid.
          Pure CSS — no photo to download, so the page paints at once even on a
          slow in-app browser. A fixed element rather than
          background-attachment: fixed, which iOS Safari ignores. */}
      <div aria-hidden="true" className="fixed inset-0 bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_-5%,rgb(77_105_172_/_0.6),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_35%_at_90%_75%,rgb(252_211_77_/_0.14),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_30%_at_5%_90%,rgb(110_139_198_/_0.22),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgb(255_255_255)_1px,transparent_1.5px)] [background-size:22px_22px]" />
      </div>

      <div className="relative flex flex-1 flex-col">
        <RuoBanner />
        {/* The offer sits straight on the backdrop; the card overlaps the bottom
            of this block. Spacing is tight on phones so the code and the button
            sit above the fold at 375px even inside the Instagram in-app
            browser. */}
        <section className="px-4 pb-24 pt-7 text-center text-white sm:px-6 sm:pb-28 sm:pt-12">
          {/* The logo artwork is mid-tone line work on a transparent ground, so
              it vanishes on navy. A light tile gives it a surface. */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 p-1.5 shadow-lg shadow-ink/40 ring-1 ring-white/50 sm:h-20 sm:w-20 sm:rounded-2xl sm:p-2.5">
            <Image
              src="/purasynth-logo.png"
              alt={ORG_NAME}
              width={112}
              height={112}
              className="h-full w-full object-contain"
            />
          </div>

          <p className="mx-auto mt-5 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:mt-8 sm:px-5 sm:py-2 sm:text-xs">
            {copy.eyebrow}
          </p>
          <h1 className="mx-auto mt-4 max-w-md text-[28px] font-bold leading-tight tracking-tight sm:mt-5 sm:text-5xl">
            {copy.headline}
            <span className="mt-1 block text-amber-300">{copy.subheadline}</span>
          </h1>

          {live && (
            <>
              <ol className="mx-auto mt-5 flex items-center justify-center gap-2 sm:mt-6 sm:gap-3" aria-label="How Buy 2, Get 1 Free works">
                {STEPS.map((step, i) => (
                  <li key={step.label} className="flex items-center gap-2 sm:gap-3">
                    {i > 0 && (
                      <span aria-hidden="true" className="text-lg font-bold text-white/60 sm:text-2xl">
                        {step.free ? "=" : "+"}
                      </span>
                    )}
                    <span
                      className={
                        step.free
                          ? "flex h-14 min-w-[5.5rem] items-center justify-center rounded-2xl bg-amber-300 px-3 text-sm font-extrabold uppercase tracking-wide text-ink shadow-lg shadow-amber-300/30 sm:h-16 sm:min-w-[6.5rem] sm:text-base"
                          : "flex h-14 min-w-[4.5rem] items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur-sm sm:h-16 sm:min-w-[5.5rem] sm:text-base"
                      }
                    >
                      {step.label}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mx-auto mt-4 inline-block max-w-md rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm sm:text-base">
                <span aria-hidden="true">🎁 </span>
                {offer.bonus}
              </p>
            </>
          )}
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-snug text-white/85 sm:mt-5 sm:text-lg sm:leading-relaxed">
            {copy.blurb}
          </p>
        </section>

        <section className="-mt-16 flex justify-center px-4 sm:-mt-20 sm:px-6">
          <OfferCard offer={offer} live={live} endsLabel={offerEndsLabel(offer)} captured={captured} />
        </section>

        <section className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 sm:py-12">
          <ul className="space-y-3">
            {TRUST.map((t) => (
              <li
                key={t.title}
                className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 backdrop-blur-sm"
              >
                <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300/20 text-amber-200">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{t.title}</span>
                  <span className="block text-sm text-white/75">{t.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
