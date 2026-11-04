import type { Metadata } from "next";
import { CC_BY, IUPAC_WEIGHTS, Ref, Source } from "@/components/science/prose";
import { BLOG_NAME } from "@/lib/blog";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `About — ${BLOG_NAME}`,
  description: "What this site is, how its numbers are produced, and where its structures and identifiers come from.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-moss-700">About</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-moss-900">{BLOG_NAME}</h1>
      <div className="mt-6 max-w-2xl space-y-4 text-[17px] leading-relaxed text-stone-800">
        <p>
          {BLOG_NAME} is a small reading room for molecular science. Each explainer starts from a definition, shows the arithmetic, and links the
          record every number comes from. The aim is the piece you wish had been on the first page of the textbook: short, concrete, and checkable.
        </p>
        <p>
          The pieces are reference material. They describe how quantities are defined and computed; they are not advice about anything, and they
          do not discuss the use of any substance.
        </p>
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-moss-900">How the numbers are produced</h2>
      <div className="mt-3 max-w-2xl space-y-4 text-[17px] leading-relaxed text-stone-800">
        <p>
          Every mass on the site is computed when the page is rendered, from one set of constants: the IUPAC abridged{" "}
          <Source href={IUPAC_WEIGHTS}>standard atomic weights</Source> for average masses, and the exact masses of the most abundant isotopes for
          monoisotopic masses. The <Ref href="/reference">reference tables</Ref>, the explainers and the <Ref href="/tools">tools</Ref> all read the
          same constants, so they cannot disagree with one another. Where another database differs in the third decimal of an average mass, the
          cause is the atomic-weight table it chose, and the explainers say so.
        </p>
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-moss-900">Sources</h2>
      <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-stone-800 marker:text-moss-500">
        <li>
          Structures and identifiers: ChEBI (Chemical Entities of Biological Interest), EMBL-EBI, under <Source href={CC_BY}>CC BY 4.0</Source>.
          Drawings on this site are redrawn from the ChEBI records they cite.
        </li>
        <li>Atomic weights and isotope masses: IUPAC Commission on Isotopic Abundances and Atomic Weights.</li>
        <li>Definitions: the IUPAC Gold Book, for molecular mass, relative molecular mass and molar mass.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-moss-900">Corrections</h2>
      <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-stone-800">
        If a number or a drawing is wrong, it is wrong at the source constant or in one component, and fixing it fixes every page at once. Each
        explainer carries the date of its last substantive edit.
      </p>
    </div>
  );
}
