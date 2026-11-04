import type { MetadataRoute } from "next";
import { ARTICLES, PATHS, articlePath } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

/** The primer series only. The offer page is noindex and is not listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const latest = ARTICLES.map((a) => a.updated).sort().at(-1)!;
  return [
    { url: absoluteUrl("/"), lastModified: latest },
    { url: absoluteUrl(PATHS.primers), lastModified: latest },
    ...ARTICLES.map((a) => ({ url: absoluteUrl(articlePath(a.slug)), lastModified: a.updated })),
    { url: absoluteUrl(PATHS.tables), lastModified: latest },
    { url: absoluteUrl(PATHS.calculators), lastModified: latest },
    { url: absoluteUrl(PATHS.about), lastModified: latest },
  ];
}
