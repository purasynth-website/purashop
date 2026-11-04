import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLE_BODIES } from "@/lib/articles";
import { ARTICLES, PATHS, SITE_NAME, articlePath, formatDate, getArticle, padNumber } from "@/lib/blog";
import { pageMeta } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMeta({ title: `${article.title} — ${SITE_NAME}`, description: article.dek, path: articlePath(slug) });
}

export default async function PrimerPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const Body = ARTICLE_BODIES[slug];
  if (!article || !Body) notFound();

  const prev = ARTICLES.find((a) => a.number === article.number - 1);
  const next = ARTICLES.find((a) => a.number === article.number + 1);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-700">
          Primer {padNumber(article.number)} of {padNumber(ARTICLES.length)} · {article.topic}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-navy-900 sm:text-5xl">{article.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{article.dek}</p>
        <p className="mt-4 border-b border-slate-200 pb-6 text-xs text-slate-500">
          {article.readMinutes} min read · Updated {formatDate(article.updated)}
        </p>
      </header>

      <div className="pt-6">
        <Body />
      </div>

      <p className="mt-10 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">
        Figures on this page are computed at render time from one set of constants (the IUPAC abridged standard atomic weights and the exact masses
        of the most abundant isotopes), the same set the <Link href={PATHS.tables} className="underline">tables</Link> and the{" "}
        <Link href={PATHS.calculators} className="underline">calculators</Link> use. Structures and identifiers after ChEBI, CC BY 4.0.
      </p>

      <nav aria-label="Primer sequence" className="mt-8 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={articlePath(prev.slug)} className="group rounded-2xl border border-slate-200 bg-white p-4 hover:border-cobalt-200">
            <span className="font-mono text-xs text-slate-500">← Primer {padNumber(prev.number)}</span>
            <span className="mt-1 block font-display font-bold text-navy-900 group-hover:text-cobalt-700">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={articlePath(next.slug)} className="group rounded-2xl border border-slate-200 bg-white p-4 text-right hover:border-cobalt-200">
            <span className="font-mono text-xs text-slate-500">Primer {padNumber(next.number)} →</span>
            <span className="mt-1 block font-display font-bold text-navy-900 group-hover:text-cobalt-700">{next.title}</span>
          </Link>
        ) : (
          <Link href={PATHS.primers} className="group rounded-2xl border border-slate-200 bg-white p-4 text-right hover:border-cobalt-200">
            <span className="font-mono text-xs text-slate-500">End of the series →</span>
            <span className="mt-1 block font-display font-bold text-navy-900 group-hover:text-cobalt-700">All primers, by topic</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
