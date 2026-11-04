import type { Metadata } from "next";
import { CC_BY, GOLD_BOOK, IUPAC_WEIGHTS, Ref, Source } from "@/components/science/prose";
import { PATHS, SITE_NAME } from "@/lib/blog";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `About — ${SITE_NAME}`,
  description: "What the primer series is, how its numbers are produced, and where its constants and structures come from.",
  path: PATHS.about,
});

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 font-display text-2xl font-bold tracking-tight text-navy-900">{children}</h2>;
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-700">About</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy-900">{SITE_NAME}</h1>
      <div className="mt-6 max-w-2xl space-y-4 text-[17px] leading-relaxed text-slate-700">
        <p>
          {SITE_NAME} is a short series on measurement in the chemistry lab: the nine things that trip people up between a data sheet and a
          weighing boat. Each primer starts from a definition, shows the arithmetic, and links the record every constant comes from. The aim is the
          page you wish had been at the front of the lab notebook.
        </p>
        <p>
          The primers are reference material. They describe how quantities are defined and computed; they are not advice about anything, and they
          do not discuss the use of any substance.
        </p>
      </div>

      <H2>How the numbers are produced</H2>
      <div className="mt-3 max-w-2xl space-y-4 text-[17px] leading-relaxed text-slate-700">
        <p>
          Every mass on the site is computed when the page is rendered, from one set of constants: the IUPAC abridged{" "}
          <Source href={IUPAC_WEIGHTS}>standard atomic weights</Source> for average masses, and the exact masses of the most abundant isotopes for
          monoisotopic masses. The <Ref href={PATHS.tables}>tables</Ref>, the primers and the <Ref href={PATHS.calculators}>calculators</Ref> all read
          the same constants, so they cannot disagree with one another. Where another source differs in the third decimal of an average mass, the
          cause is the atomic-weight table it chose, and the primers say so.
        </p>
      </div>

      <H2>Sources</H2>
      <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-slate-700 marker:text-cobalt-600">
        <li>Atomic weights and isotope masses: IUPAC Commission on Isotopic Abundances and Atomic Weights.</li>
        <li>
          Definitions: the <Source href={GOLD_BOOK}>IUPAC Gold Book</Source>, for mole, molar mass, relative molecular mass and the rest.
        </li>
        <li>
          Structures and identifiers: ChEBI (Chemical Entities of Biological Interest), EMBL-EBI, under <Source href={CC_BY}>CC BY 4.0</Source>.
          Drawings on this site are redrawn from the ChEBI records they cite.
        </li>
      </ul>

      <H2>Corrections</H2>
      <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-slate-700">
        If a number or a drawing is wrong, it is wrong at the source constant or in one component, and fixing it fixes every page at once. Each
        primer carries the date of its last substantive edit.
      </p>
    </div>
  );
}
