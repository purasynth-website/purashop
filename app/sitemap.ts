import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

/** The reading room only. The offer page is noindex and is not listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const latest = ARTICLES.map((a) => a.updated).sort().at(-1)!;
  return [
    { url: absoluteUrl("/"), lastModified: latest },
    { url: absoluteUrl("/articles"), lastModified: latest },
    ...ARTICLES.map((a) => ({ url: absoluteUrl(`/articles/${a.slug}`), lastModified: a.updated })),
    { url: absoluteUrl("/reference"), lastModified: latest },
    { url: absoluteUrl("/tools"), lastModified: latest },
    { url: absoluteUrl("/about"), lastModified: latest },
  ];
}
