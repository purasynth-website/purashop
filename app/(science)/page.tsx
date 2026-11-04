import type { Metadata } from "next";
import Link from "next/link";
import { ArticleListItem } from "@/components/science/article-card";
import { CHEBI, Source } from "@/components/science/prose";
import { Formula, GlycineStructure, IsoleucineStructure, LeucineStructure } from "@/components/science/structures";
import { ARTICLES, BLOG_DESCRIPTION, BLOG_NAME, BLOG_TAGLINE, formatDate, getArticle } from "@/lib/blog";
import { fmt, formulaMass } from "@/lib/mass";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `${BLOG_NAME} — ${BLOG_TAGLINE}`,
  description: BLOG_DESCRIPTION,
  path: "/",
});

const ESSENTIAL = [
  "molecular-weight-molecular-mass-and-molar-mass",
  "amino-acids-peptide-residues-and-sequence-mass",
  "how-to-read-a-two-dimensional-chemical-structure",
  "calculated-properties-and-experimental-evidence",
].map((slug) => getArticle(slug)!);

const FEATURED = getArticle("a-molecular-formula-is-not-a-unique-identity")!;
const RAIL = getArticle("average-exact-and-monoisotopic-mass")!;

const glycine = formulaMass("C2H5NO2");

function RailHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="border-b-2 border-moss-900 pb-2 font-display text-lg font-semibold tracking-tight text-moss-900">{children}</h2>;
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <p className="border-b border-stone-200 py-4 text-sm text-stone-600">
        Source-linked explanations. <strong className="text-stone-800">Molecular science, made clear.</strong>
      </p>

      <div className="grid gap-10 py-8 lg:grid-cols-[220px_minmax(0,1fr)_240px] lg:gap-8">
        {/* Essential reading */}
        <aside className="order-2 lg:order-none">
          <RailHeading>Essential reading</RailHeading>
          <ul className="mt-2">
            {ESSENTIAL.map((a) => (
              <ArticleListItem key={a.slug} article={a} />
            ))}
          </ul>
          <Link href="/articles" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-moss-700 hover:underline">
            Reading room <span aria-hidden="true">→</span>
          </Link>
        </aside>

        {/* Featured */}
        <section className="order-1 lg:order-none">
          <figure className="overflow-hidden rounded-2xl border border-moss-100 bg-gradient-to-r from-moss-50 via-moss-50 to-moss-100/80 p-5 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-moss-700">One formula, two structures</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
              <p className="font-display text-5xl font-semibold tracking-tight text-moss-900 sm:text-6xl">
                <Formula>C6H13NO2</Formula>
              </p>
              <p className="text-xs text-stone-500">Shared composition</p>
            </div>
            <div className="mt-6 grid gap-6 text-moss-900 sm:grid-cols-2">
              <div>
                <LeucineStructure className="w-full max-w-[260px]" title="L-leucine, skeletal formula" />
                <p className="mt-2 text-sm font-semibold">L-Leucine</p>
                <p className="text-xs text-stone-500">2S</p>
              </div>
              <div>
                <IsoleucineStructure className="w-full max-w-[260px]" title="L-isoleucine, skeletal formula" />
                <p className="mt-2 text-sm font-semibold">L-Isoleucine</p>
                <p className="text-xs text-stone-500">2S,3S</p>
              </div>
            </div>
            <figcaption className="mt-5 border-t border-moss-200/70 pt-3 text-sm text-stone-600">The branching makes the difference.</figcaption>
          </figure>
          <p className="mt-2 text-xs text-stone-500">
            Neutral, non-zwitterionic forms. <Source href={CHEBI(15603)}>CHEBI:15603</Source> &amp; <Source href={CHEBI(17191)}>CHEBI:17191</Source> · ChEBI,{" "}
            <Source href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</Source>. Redrawn in 2D.
          </p>

          <article className="mt-8 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-moss-700">{FEATURED.category}</p>
            <h1 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-moss-900 sm:text-5xl">
              <Link href={`/articles/${FEATURED.slug}`} className="hover:underline hover:decoration-moss-300 hover:underline-offset-4">
                {FEATURED.title}
              </Link>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-stone-700">{FEATURED.summary}</p>
            <p className="mt-3 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Explainer</span>
              <span className="mx-1.5">·</span>
              {FEATURED.readMinutes} min read
              <span className="mx-1.5">·</span>
              {formatDate(FEATURED.updated)}
            </p>
          </article>
        </section>

        {/* Explore the science */}
        <aside className="order-3 lg:order-none">
          <RailHeading>Explore the science</RailHeading>

          <div className="mt-4 rounded-2xl border border-moss-100 bg-moss-50/70 p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-stone-800">Glycine</p>
              <p className="text-xs text-stone-500">
                <Formula>C2H5NO2</Formula>
              </p>
            </div>
            <p className="mt-3 font-display text-3xl font-semibold tabular-nums tracking-tight text-moss-900">
              {fmt(glycine.average, 3)}
              <span className="ml-1 text-xs font-normal text-stone-500">Da</span>
            </p>
            <p className="text-xs text-stone-500">Average molecular mass</p>
            <p className="mt-3 font-display text-3xl font-semibold tabular-nums tracking-tight text-moss-900">
              {fmt(glycine.mono, 5)}
              <span className="ml-1 text-xs font-normal text-stone-500">Da</span>
            </p>
            <p className="text-xs text-stone-500">Monoisotopic mass</p>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-stone-500">
            Computed from the formula; ChEBI display precision retained. <Source href={CHEBI(15428)}>CHEBI:15428</Source> · ChEBI,{" "}
            <Source href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</Source>.
          </p>

          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-moss-700">{RAIL.category}</p>
            <Link href={`/articles/${RAIL.slug}`} className="group mt-1 block">
              <span className="font-display text-lg font-semibold leading-snug tracking-tight text-moss-900 group-hover:underline group-hover:decoration-moss-300 group-hover:underline-offset-4">
                {RAIL.title}
              </span>
            </Link>
            <p className="mt-1.5 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Explainer</span>
              <span className="mx-1.5">·</span>
              {RAIL.readMinutes} min read
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 text-moss-900">
            <p className="font-display text-lg font-semibold">Glycine</p>
            <p className="text-xs text-stone-500">CHEBI:15428</p>
            <GlycineStructure className="mx-auto mt-3 w-full max-w-[200px]" title="Glycine, skeletal formula" />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Source SMILES</p>
            <p className="mt-1 font-mono text-sm text-moss-700">NCC(=O)O</p>
            <p className="mt-2 text-[11px] text-stone-500">Glycine, non-zwitterionic representation.</p>
          </div>
        </aside>
      </div>

      <section className="border-t border-stone-200 py-8">
        <h2 className="font-display text-xl font-semibold tracking-tight text-moss-900">All explainers</h2>
        <ul className="mt-2 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => (
            <ArticleListItem key={a.slug} article={a} showDate />
          ))}
        </ul>
      </section>
    </div>
  );
}
