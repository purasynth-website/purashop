import type { Metadata } from "next";
import { PrimerRow } from "@/components/science/article-card";
import { ARTICLES, PATHS, SITE_NAME, TOPICS, TOPIC_DESCRIPTIONS } from "@/lib/blog";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `All primers, by topic — ${SITE_NAME}`,
  description: "The nine primers grouped by topic: quantities and units, mass and formula, structure, data sheets.",
  path: PATHS.primers,
});

export default function PrimersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-700">Primers</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy-900">All nine, by topic</h1>
      <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-slate-700">
        Each primer stands alone, but the numbers follow the reading order on the front page: the earlier ones define what the later ones use.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {TOPICS.map((topic) => (
          <section key={topic} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold tracking-tight text-navy-900">{topic}</h2>
            <p className="mt-1 text-sm text-slate-600">{TOPIC_DESCRIPTIONS[topic]}</p>
            <ul className="mt-4">
              {ARTICLES.filter((a) => a.topic === topic).map((a) => (
                <PrimerRow key={a.slug} article={a} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
