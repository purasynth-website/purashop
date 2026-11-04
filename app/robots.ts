import type { MetadataRoute } from "next";

/**
 * Crawling is allowed everywhere but the API. The offer page keeps itself out
 * of the search index with a page-level noindex, NOT a Disallow here: a
 * robots.txt block also stops Google's ad crawlers, which ad review treats as
 * "landing page not crawlable". AdsBot ignores wildcard rules, so it is
 * allowed explicitly.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: "AdsBot-Google", allow: "/" },
      { userAgent: "AdsBot-Google-Mobile", allow: "/" },
    ],
  };
}
