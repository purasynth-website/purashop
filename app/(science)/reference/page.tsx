import type { Metadata } from "next";
import { IUPAC_WEIGHTS, Ref, Source, Table } from "@/components/science/prose";
import { Formula } from "@/components/science/structures";
import { BLOG_NAME } from "@/lib/blog";
import { ATOMIC_MASS, PROTON_MASS, RESIDUES, fmt, formulaMass, residueMass } from "@/lib/mass";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `Reference tables — ${BLOG_NAME}`,
  description:
    "Atomic masses, the twenty amino acid residue masses, and a few small molecules, monoisotopic and average, computed from one set of constants.",
  path: "/reference",
});

const SMALL_MOLECULES = [
  { name: "Water", formula: "H2O" },
  { name: "Glycine", formula: "C2H5NO2" },
  { name: "Alanine", formula: "C3H7NO2" },
  { name: "Leucine / Isoleucine", formula: "C6H13NO2" },
  { name: "Glucose", formula: "C6H12O6" },
  { name: "Caffeine", formula: "C8H10N4O2" },
];

export default function ReferencePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-moss-700">Reference</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-moss-900">The numbers, in one place</h1>
      <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-stone-700">
        Every value below is computed from the constants in the first table. The explainers quote the same constants, so the tables and the text
        cannot disagree. Monoisotopic masses are exact to five decimals; average masses depend on the atomic weights chosen and can differ from
        other sources in the third decimal place.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-moss-900">Atomic masses</h2>
      <Table
        head={["Element", "Symbol", "Monoisotopic (Da)", "Standard atomic weight"]}
        mono={[1, 2, 3]}
        rows={(Object.keys(ATOMIC_MASS) as Array<keyof typeof ATOMIC_MASS>).map((el) => [
          ATOMIC_MASS[el].name,
          el,
          ATOMIC_MASS[el].mono.toFixed(8),
          ATOMIC_MASS[el].average.toFixed(3),
        ])}
        caption="Monoisotopic: exact mass of the most abundant isotope (12C, 1H, 14N, 16O, 32S). Standard atomic weight: IUPAC abridged value, 2021."
      />
      <p className="mt-3 text-sm text-stone-600">
        Source: IUPAC Commission on Isotopic Abundances and Atomic Weights, <Source href={IUPAC_WEIGHTS}>standard atomic weights</Source>. Proton
        mass, for [M+H]<sup>+</sup>: {PROTON_MASS.toFixed(8)} Da.
      </p>

      <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight text-moss-900">Amino acid residues</h2>
      <p className="mt-2 text-sm text-stone-600">
        A residue is the amino acid minus one water. The mass of a linear peptide is the sum of its residues plus one water, as explained in{" "}
        <Ref href="/articles/amino-acids-peptide-residues-and-sequence-mass">amino acids, peptide residues and sequence mass</Ref>.
      </p>
      <Table
        head={["Residue", "Codes", "Residue formula", "Monoisotopic (Da)", "Average (Da)", "Free amino acid, mono (Da)"]}
        mono={[2, 3, 4, 5]}
        rows={RESIDUES.map((r) => {
          const m = residueMass(r.one)!;
          const free = formulaMass(r.formula).mono + formulaMass("H2O").mono;
          return [r.name, `${r.three} · ${r.one}`, <Formula key={r.one}>{r.formula}</Formula>, fmt(m.mono, 5), fmt(m.average, 3), fmt(free, 5)];
        })}
        caption="Leucine and isoleucine are constitutional isomers and share every value in this table."
      />

      <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight text-moss-900">Small molecules</h2>
      <Table
        head={["Compound", "Formula", "Monoisotopic (Da)", "Average (Da)"]}
        mono={[1, 2, 3]}
        rows={SMALL_MOLECULES.map((m) => {
          const mass = formulaMass(m.formula);
          return [m.name, <Formula key={m.formula}>{m.formula}</Formula>, fmt(mass.mono, 5), fmt(mass.average, 3)];
        })}
      />
    </div>
  );
}
