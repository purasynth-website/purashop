import type { Metadata } from "next";
import Link from "next/link";
import { PrimerCard } from "@/components/science/article-card";
import { GOLD_BOOK, IUPAC_WEIGHTS } from "@/components/science/prose";
import { ARTICLES, PATHS, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, articlePath } from "@/lib/blog";
import { fmt, formulaMass } from "@/lib/mass";
import { massToWeigh, toSignificant } from "@/lib/units";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  path: "/",
});

const glucose = formulaMass("C6H12O6");
const grams = massToWeigh(0.1, 0.25, glucose.average);
const FIRST = ARTICLES[0];

const SOURCES = [
  {
    name: "IUPAC standard atomic weights",
    what: "Every average mass on the site is summed from the abridged values; monoisotopic masses from the exact isotope masses.",
    href: IUPAC_WEIGHTS,
  },
  {
    name: "ChEBI",
    what: "Structures and identifiers for the drawn molecules, redrawn from the cited records under CC BY 4.0.",
    href: "https://www.ebi.ac.uk/chebi/",
  },
  {
    name: "IUPAC Gold Book",
    what: "The definitions of mole, molar mass, relative molecular mass and the rest, quoted rather than paraphrased where it matters.",
    href: GOLD_BOOK,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="grid-paper border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-700">A nine-part primer series</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-navy-900 sm:text-6xl">
            Numbers you can check.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
            How the quantities on a data sheet are defined, computed and measured: moles, concentrations, units, the two masses of a molecule, line
            drawings. Every calculation is shown. Every constant has a source.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={articlePath(FIRST.slug)}
              className="inline-flex h-11 items-center rounded-full bg-navy-900 px-6 text-sm font-semibold text-white hover:bg-cobalt-700"
            >
              Start with the mole <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <Link
              href={PATHS.calculators}
              className="inline-flex h-11 items-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-navy-900 hover:border-cobalt-600 hover:text-cobalt-700"
            >
              Open the calculators
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-500">Reference material for the bench. Not advice.</p>
        </div>
      </section>

      {/* Reading order */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-700">Reading order</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">Nine primers, in the order they build</h2>
          </div>
          <Link href={PATHS.primers} className="hidden text-sm font-medium text-cobalt-700 hover:underline sm:block">
            By topic →
          </Link>
        </div>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => (
            <PrimerCard key={a.slug} article={a} />
          ))}
        </ol>
      </section>

      {/* Worked example */}
      <section className="grid-paper-dark bg-navy-900 text-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-200">A worked example</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">How much glucose for 250 mL of 0.100 mol/L?</h2>
            <p className="mt-3 max-w-md leading-relaxed text-slate-300">
              Concentration times volume times molar mass. Litres cancel, moles cancel, grams remain. The same multiplication the solution
              calculator runs, with the purity correction when the bottle says 98%.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
              <Link href={articlePath("making-a-solution-to-a-target-concentration")} className="text-cobalt-200 underline decoration-cobalt-200/50 underline-offset-4 hover:decoration-cobalt-200">
                Read primer 02
              </Link>
              <Link href={`${PATHS.calculators}#solution`} className="text-cobalt-200 underline decoration-cobalt-200/50 underline-offset-4 hover:decoration-cobalt-200">
                Open the solution calculator
              </Link>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-5 font-mono text-[14px] leading-7 text-slate-100">
            {[
              `c   0.100 mol/L`,
              `V   0.250 L`,
              `M   ${fmt(glucose.average, 3)} g/mol   (C6H12O6)`,
              ``,
              `m = c × V × M`,
              `  = 0.100 × 0.250 × ${fmt(glucose.average, 3)}`,
              `  = ${toSignificant(grams, 4)} g`,
            ].join("\n")}
          </pre>
        </div>
      </section>

      {/* Calculators */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-700">Calculators</p>
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">The arithmetic, done for you</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link href={`${PATHS.calculators}#solution`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-cobalt-200">
            <p className="font-display text-lg font-bold text-navy-900 group-hover:text-cobalt-700">Solution preparation</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Mass to weigh for a target concentration and volume, from a formula or a molar mass, with the purity correction.
            </p>
          </Link>
          <Link href={`${PATHS.calculators}#peptide`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-cobalt-200">
            <p className="font-display text-lg font-bold text-navy-900 group-hover:text-cobalt-700">Sequence mass</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Monoisotopic and average mass of a chain from its one-letter codes, with the formula and the residue-by-residue sum.
            </p>
          </Link>
        </div>
      </section>

      {/* Sources */}
      <section className="mx-auto max-w-5xl px-4 pb-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-700">Where the constants come from</p>
          <ul className="mt-4 grid gap-6 sm:grid-cols-3">
            {SOURCES.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-display text-base font-bold text-navy-900 underline decoration-cobalt-200 underline-offset-4 hover:decoration-cobalt-700">
                  {s.name}
                </a>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.what}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
