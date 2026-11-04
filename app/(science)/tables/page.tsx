import type { Metadata } from "next";
import { IUPAC_WEIGHTS, Ref, Source, Table } from "@/components/science/prose";
import { Formula } from "@/components/science/structures";
import { PATHS, SITE_NAME, articlePath } from "@/lib/blog";
import { ATOMIC_MASS, PROTON_MASS, RESIDUES, fmt, formulaMass, residueMass } from "@/lib/mass";
import { SI_PREFIXES } from "@/lib/units";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `Tables — ${SITE_NAME}`,
  description:
    "Atomic masses, SI prefixes, the twenty amino acid residue masses and a few small molecules, monoisotopic and average, computed from one set of constants.",
  path: PATHS.tables,
});

const SMALL_MOLECULES = [
  { name: "Water", formula: "H2O" },
  { name: "Glycine", formula: "C2H5NO2" },
  { name: "Alanine", formula: "C3H7NO2" },
  { name: "Leucine / Isoleucine", formula: "C6H13NO2" },
  { name: "Glucose (anhydrous)", formula: "C6H12O6" },
  { name: "Glucose monohydrate", formula: "C6H14O7" },
  { name: "Caffeine", formula: "C8H10N4O2" },
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-navy-900">{children}</h2>;
}

export default function TablesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-700">Tables</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy-900">The constants, in one place</h1>
      <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-slate-700">
        Every value below is computed from the first table. The primers quote the same constants, so the tables and the text cannot disagree.
        Monoisotopic masses are exact to five decimals; average masses depend on the atomic weights chosen and can differ from other sources in the
        third decimal place.
      </p>

      <H2>Atomic masses</H2>
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
      <p className="mt-3 text-sm text-slate-600">
        Source: IUPAC Commission on Isotopic Abundances and Atomic Weights, <Source href={IUPAC_WEIGHTS}>standard atomic weights</Source>. Proton
        mass, for [M+H]<sup>+</sup>: {PROTON_MASS.toFixed(8)} Da.
      </p>

      <H2>SI prefixes</H2>
      <Table
        head={["Prefix", "Symbol", "Factor"]}
        mono={[1, 2]}
        rows={SI_PREFIXES.map((p) => [p.name, p.symbol || "–", p.factor >= 1 ? `×${p.factor.toLocaleString("en-US")}` : `×10^${Math.round(Math.log10(p.factor))}`])}
        caption="Each step is a factor of a thousand. See the primer on changing units."
      />

      <H2>Amino acid residues</H2>
      <p className="mt-2 text-sm text-slate-600">
        A residue is the amino acid minus one water. The mass of a linear chain is the sum of its residues plus one water, as explained in{" "}
        <Ref href={articlePath("the-arithmetic-of-chains")}>The arithmetic of chains</Ref>.
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

      <H2>Small molecules</H2>
      <Table
        head={["Compound", "Formula", "Monoisotopic (Da)", "Average (Da)"]}
        mono={[1, 2, 3]}
        rows={SMALL_MOLECULES.map((m) => {
          const mass = formulaMass(m.formula);
          return [m.name, <Formula key={m.formula}>{m.formula}</Formula>, fmt(mass.mono, 5), fmt(mass.average, 3)];
        })}
        caption="The monohydrate row is the anhydrous row plus one water: the molar mass to use when that is what is in the bottle."
      />
    </div>
  );
}
