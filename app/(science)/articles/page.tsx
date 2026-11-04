import type { Metadata } from "next";
import { ArticleListItem } from "@/components/science/article-card";
import { ARTICLES, BLOG_NAME, CATEGORY_DESCRIPTIONS, type Category } from "@/lib/blog";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `Reading room — ${BLOG_NAME}`,
  description: "Every explainer on the site, grouped by topic: molecular mass, biochemical definitions and chemical structures.",
  path: "/articles",
});

const CATEGORIES: Category[] = ["Molecular mass", "Biochemical definitions", "Chemical structures"];

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-moss-700">Reading room</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-moss-900">All explainers</h1>
      <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-stone-700">
        Short pieces that start from a definition, show the arithmetic, and link the record every number comes from. Read them in any order; each
        one stands alone.
      </p>
      <div className="mt-10 grid gap-10 md:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <section key={cat}>
            <h2 className="border-b-2 border-moss-900 pb-2 font-display text-lg font-semibold tracking-tight text-moss-900">{cat}</h2>
            <p className="mt-2 text-sm text-stone-600">{CATEGORY_DESCRIPTIONS[cat]}</p>
            <ul className="mt-2">
              {ARTICLES.filter((a) => a.category === cat).map((a) => (
                <ArticleListItem key={a.slug} article={a} showDate />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
