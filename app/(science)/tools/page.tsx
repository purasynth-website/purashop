import type { Metadata } from "next";
import { PeptideMassCalculator } from "@/components/science/peptide-mass-calculator";
import { Ref } from "@/components/science/prose";
import { BLOG_NAME } from "@/lib/blog";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `Peptide mass calculator — ${BLOG_NAME}`,
  description:
    "Monoisotopic and average mass of a peptide from its one-letter sequence, with the formula, the [M+H]+ value and the residue-by-residue sum.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-moss-700">Tools</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-moss-900">Peptide mass calculator</h1>
      <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-stone-700">
        Type a sequence in one-letter codes. The tool sums the residue masses and adds one water for the free termini, the arithmetic described
        in <Ref href="/articles/amino-acids-peptide-residues-and-sequence-mass">amino acids, peptide residues and sequence mass</Ref>. It runs in
        your browser; nothing you type is sent anywhere.
      </p>
      <div className="mt-8">
        <PeptideMassCalculator />
      </div>
      <section className="mt-8 max-w-2xl text-sm leading-relaxed text-stone-600">
        <h2 className="font-display text-lg font-semibold text-moss-900">What it does not do</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Modifications: no acetylation, amidation, phosphorylation, disulfide bridges or cyclisation. Adjust the formula by hand.</li>
          <li>Charge states beyond [M+H]<sup>+</sup>: for [M+2H]<sup>2+</sup> add two protons and halve.</li>
          <li>Non-standard residues: only the twenty proteinogenic amino acids are known.</li>
        </ul>
      </section>
    </div>
  );
}
