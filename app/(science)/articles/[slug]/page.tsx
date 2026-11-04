import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleListItem } from "@/components/science/article-card";
import { ARTICLE_BODIES } from "@/lib/articles";
import { ARTICLES, BLOG_NAME, formatDate, getArticle } from "@/lib/blog";
import { pageMeta } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMeta({ title: `${article.title} — ${BLOG_NAME}`, description: article.summary, path: `/articles/${slug}` });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const Body = ARTICLE_BODIES[slug];
  if (!article || !Body) notFound();

  const related = ARTICLES.filter((a) => a.slug !== slug && a.category === article.category).slice(0, 3);
  const more = related.length > 0 ? related : ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article>
          <header className="border-b border-stone-200 pb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-moss-700">{article.category}</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-moss-900 sm:text-5xl">{article.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-700">{article.summary}</p>
            <p className="mt-4 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Explainer</span>
              <span className="mx-1.5">·</span>
              {article.readMinutes} min read
              <span className="mx-1.5">·</span>
              Updated {formatDate(article.updated)}
            </p>
          </header>
          <div className="max-w-2xl pt-6">
            <Body />
          </div>
          <p className="mt-10 max-w-2xl border-t border-stone-200 pt-4 text-xs leading-relaxed text-stone-500">
            Figures on this page are computed at render time from one set of constants (the IUPAC abridged standard atomic weights and the exact
            masses of the most abundant isotopes), the same set the <Link href="/reference" className="underline">reference tables</Link> and the{" "}
            <Link href="/tools" className="underline">tools</Link> use. Structures and identifiers after ChEBI, CC BY 4.0.
          </p>
        </article>

        <aside>
          <h2 className="border-b-2 border-moss-900 pb-2 font-display text-lg font-semibold tracking-tight text-moss-900">Read next</h2>
          <ul className="mt-2">
            {more.map((a) => (
              <ArticleListItem key={a.slug} article={a} />
            ))}
          </ul>
          <Link href="/articles" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-moss-700 hover:underline">
            All explainers <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
