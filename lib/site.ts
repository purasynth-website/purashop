import type { Metadata } from "next";

/**
 * Site-level configuration. Everything that depends on the hostname or the
 * public identity lives here, so a rename or a domain move is a one-file change.
 */
const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

const DEFAULT_SITE_URL = "https://purasynth.shop";

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL in Vercel (Production + Preview)
 * to the https origin with no trailing slash. Anything that is not a parseable
 * https URL (unset, http, localhost, a typo) falls back to the live domain so
 * absolute URLs are never wrong in production and the build never throws.
 */
export const SITE_URL =
  envUrl && envUrl.startsWith("https://") && URL.canParse(envUrl) ? envUrl : DEFAULT_SITE_URL;

/** Hostname shown as the wordmark, derived from the canonical origin. */
export const SITE_DOMAIN = new URL(SITE_URL).host;

/** Public organisation identity. */
export const ORG_NAME = "PuraSynth Labs";

/**
 * Build an absolute URL for `path` against the canonical origin. Idempotent:
 * an already-absolute http(s) URL is returned unchanged.
 */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Per-page <head> metadata: unique title, description and a self-referencing
 * canonical. `title` is used as the full <title> (the layout template is
 * bypassed). Pass `noindex` for pages that must not compete with the store in
 * search (the offer page is a bridge, not a destination).
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const { title, description, path, noindex } = opts;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: { index: !noindex, follow: true },
  };
}
