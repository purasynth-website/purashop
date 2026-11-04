import type { Metadata, Viewport } from "next";
import { OFFER_VIEWPORT, OfferPage, offerMetadata, type OfferRouteProps } from "@/components/offer-page";
import { liveOffer } from "@/lib/offer";

/**
 * The offer page at the root. Which deal it hands out is liveOffer() in
 * lib/offer.ts, decided on every request (the page is dynamic). This file is a
 * thin shell over components/offer-page.tsx.
 */
export const viewport: Viewport = OFFER_VIEWPORT;

export function generateMetadata(): Metadata {
  return offerMetadata("/", liveOffer());
}

export default function RootOfferPage(props: OfferRouteProps) {
  return <OfferPage offer={liveOffer()} {...props} />;
}
