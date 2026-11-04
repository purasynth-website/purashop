/**
 * Reporting one event to the Meta Pixel, from the client.
 *
 * Kept apart from components/meta-pixel.tsx so the claim button can import it
 * without pulling the whole script component into the client bundle.
 */

declare global {
  interface Window {
    /** Defined once Meta's snippet has run. It is absent while the script is
     *  still loading and whenever a blocker or a strict network removes it, so
     *  every call site has to guard. */
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * The one funnel step that happens on THIS domain: the visitor took the code
 * and left for the store. Custom rather than a standard event, so it can never
 * be mistaken for a Lead or a Purchase in the ad account's own reporting —
 * it is still usable for a custom conversion or an audience.
 */
export const CLAIM_EVENT = "ClaimClick";

/**
 * Fire an event at every initialised pixel. Never throws and never waits: this
 * runs microseconds before the page navigates away, and a missing, blocked or
 * still-loading pixel must not cost the visitor their click.
 */
export function trackPixel(event: string): void {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("trackCustom", event);
  } catch {
    /* blocked, offline, or still loading — the navigation matters more */
  }
}
