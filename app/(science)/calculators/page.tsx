import type { Metadata } from "next";
import { PeptideMassCalculator } from "@/components/science/peptide-mass-calculator";
import { Ref } from "@/components/science/prose";
import { SolutionCalculator } from "@/components/science/solution-calculator";
import { PATHS, SITE_NAME, articlePath } from "@/lib/blog";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `Calculators — ${SITE_NAME}`,
  description:
    "Two bench calculators: the mass to weigh for a target concentration and volume, and the monoisotopic and average mass of a sequence from its one-letter codes.",
  path: PATHS.calculators,
});

export default function CalculatorsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-700">Calculators</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy-900">The arithmetic, done for you</h1>
      <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-slate-700">
        Both run in your browser; nothing you type is sent anywhere. They use the same constants as the primers and the tables.
      </p>

      <section id="solution" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900">Solution preparation</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">
          Mass to weigh = concentration × volume × molar mass ÷ purity, the multiplication in{" "}
          <Ref href={articlePath("making-a-solution-to-a-target-concentration")}>Making a solution to a target concentration</Ref>. Give the solid
          as a formula (C, H, N, O, S) or as a molar mass in g/mol; use the molar mass of the form in the bottle (hydrate, salt).
        </p>
        <div className="mt-5">
          <SolutionCalculator />
        </div>
      </section>

      <section id="peptide" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900">Sequence mass</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">
          The sum of the residues plus one water for the free termini, the arithmetic in{" "}
          <Ref href={articlePath("the-arithmetic-of-chains")}>The arithmetic of chains</Ref>. Unmodified chains only: no acetylation, amidation,
          phosphorylation, bridges or cyclisation, and only the twenty standard residues.
        </p>
        <div className="mt-5">
          <PeptideMassCalculator />
        </div>
      </section>
    </div>
  );
}
