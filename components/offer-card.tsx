"use client";

import { useEffect, useRef, useState } from "react";
import { OFFER_ENDED, buildClaimUrl, type Captured, type Offer } from "@/lib/offer";
import { captureAttribution, readAttribution } from "@/lib/attribution";
import { CLAIM_EVENT, trackPixel } from "@/lib/pixel";

/**
 * The code box and the claim button. A codeless offer (the store applies the
 * deal in the cart by itself) gets the button alone: no box, nothing to copy.
 *
 * The button is a real link to the store with the code attached, so it works
 * with no JavaScript at all — and, since `captured` is read from the request
 * on the server (components/offer-page.tsx), the link is already carrying the
 * visitor's platform in the HTML itself. That is what makes a tap, a
 * long-press, an "open in browser" or a JavaScript-off visit land on the store
 * correctly whenever it happens, instead of only after React has hydrated.
 *
 * The effect below stays as a backstop for the second page view in a tab,
 * where the URL no longer has the tags but sessionStorage still remembers
 * them. It merges rather than replaces: a client with nothing stored must
 * never overwrite a good link the server already built.
 */
export function OfferCard({
  offer,
  live,
  endsLabel,
  captured,
}: {
  /** The deal this page hands out: the code shown, copied and put on the link. */
  offer: Offer;
  live: boolean;
  endsLabel: string | null;
  /** Tags, click ids and in-app-browser source read from the request. */
  captured: Captured;
}) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const claimLink = useRef<HTMLAnchorElement | null>(null);
  const baseHref = buildClaimUrl(offer, captured, { live });
  /** The code to show and copy, or null: an ended offer and a codeless one both have no box. */
  const code: string | null = live ? offer.code : null;

  /** What this page view knows now: the request, then anything the tab has
   *  remembered since (a later page view keeps the landing's tags). */
  function claimUrl(): string {
    return buildClaimUrl(offer, { ...captured, ...readAttribution() }, { live });
  }

  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  useEffect(() => {
    // This effect runs before the layout's own capture (children first), so
    // capture here too; it is the same call and harmless to repeat.
    captureAttribution();
    if (claimLink.current) claimLink.current.href = claimUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, captured, offer]);

  async function copyCode() {
    if (code === null) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked (some in-app browsers): the code stays visible, and the link applies it anyway */
    }
  }

  function claim(e: React.MouseEvent<HTMLAnchorElement>) {
    // Plain left click only; let new-tab / long-press behave like any link —
    // the href they follow is already correct.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    // The only funnel step that happens on this domain. Fired before the
    // navigation and deliberately not waited on.
    trackPixel(CLAIM_EVENT);
    window.location.assign(claimUrl());
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-5 text-center shadow-xl shadow-ink/40 ring-1 ring-brand-100 sm:p-8">
      {code !== null && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
            Your discount code
          </p>
          <button
            type="button"
            onClick={copyCode}
            aria-label={copied ? `Code ${code} copied` : `Copy code ${code}`}
            className="mt-3 flex min-h-20 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 px-4 py-3 transition-colors hover:bg-brand-100 active:bg-brand-100 sm:mt-4"
          >
            <span className="font-mono text-4xl font-bold tracking-[0.15em] text-ink">{code}</span>
            <span className="mt-1 text-xs font-medium text-brand-600" aria-live="polite">
              {copied ? "Copied" : "Tap to copy"}
            </span>
          </button>
        </>
      )}

      <a
        ref={claimLink}
        href={baseHref}
        onClick={claim}
        className={`${code !== null ? "mt-4 sm:mt-5" : ""} flex min-h-14 w-full items-center justify-center rounded-full bg-brand-600 px-6 text-lg font-semibold text-white transition-colors hover:bg-brand-700 active:bg-brand-800`}
      >
        {live ? offer.cta : OFFER_ENDED.cta}
        <span aria-hidden="true" className="ml-2">→</span>
      </a>

      <p className="mt-3 text-xs leading-relaxed text-slate-500 sm:mt-4 sm:text-sm">
        {live
          ? `${endsLabel ? `Offer ends ${endsLabel}. ` : ""}${
              code !== null
                ? "Takes you to purasynth.com — the code applies at checkout."
                : "Takes you to purasynth.com — the free vial is added in your cart."
            }`
          : "Opens purasynth.com."}
      </p>
    </div>
  );
}
