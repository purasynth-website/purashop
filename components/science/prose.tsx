import type { ReactNode } from "react";
import Link from "next/link";

/**
 * The handful of elements an explainer is written with. Keeping them as
 * components (rather than a Markdown pipeline) means the articles can embed
 * live numbers from lib/mass.ts and the structure drawings directly.
 */

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[17px] leading-relaxed text-stone-800 first:mt-0">{children}</p>;
}

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mt-10 scroll-mt-24 font-display text-2xl font-semibold tracking-tight text-moss-900">
      {children}
    </h2>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-stone-800 marker:text-moss-500">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

/** Inline code: a formula, a SMILES string, a unit. */
export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-moss-50 px-1.5 py-0.5 font-mono text-[0.92em] text-moss-900 ring-1 ring-moss-100">{children}</code>;
}

/** A worked calculation, one line per step. */
export function Calc({ lines, caption }: { lines: string[]; caption?: string }) {
  return (
    <figure className="mt-5 overflow-x-auto rounded-xl border border-moss-100 bg-moss-50/60 p-4">
      <pre className="font-mono text-[14px] leading-7 text-moss-900">{lines.join("\n")}</pre>
      {caption && <figcaption className="mt-2 text-sm text-stone-600">{caption}</figcaption>}
    </figure>
  );
}

/** A short aside the reader can skip. */
export function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="mt-6 rounded-xl border-l-4 border-moss-500 bg-stone-50 px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss-700">{title}</p>
      <div className="mt-1 text-[15px] leading-relaxed text-stone-700">{children}</div>
    </aside>
  );
}

/** The key points, placed at the end of every explainer. */
export function KeyPoints({ items }: { items: ReactNode[] }) {
  return (
    <section className="mt-10 rounded-2xl bg-moss-900 px-6 py-5 text-moss-50">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss-200">Key points</p>
      <ul className="mt-3 space-y-2 text-[15px] leading-relaxed">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-moss-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** A link to a source record, shown with its identifier. */
export function Source({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-moss-700 underline decoration-moss-300 underline-offset-2 hover:decoration-moss-700">
      {children}
    </a>
  );
}

/** An internal link to another explainer or page. */
export function Ref({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-moss-700 underline decoration-moss-300 underline-offset-2 hover:decoration-moss-700">
      {children}
    </Link>
  );
}

/** A data table for the explainers and the reference page. */
export function Table({ head, rows, caption, mono }: { head: ReactNode[]; rows: ReactNode[][]; caption?: string; mono?: number[] }) {
  return (
    <figure className="mt-5 overflow-x-auto rounded-xl border border-stone-200">
      <table className="w-full text-left text-[14px]">
        <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-600">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-stone-800">
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-stone-50/50">
              {r.map((c, j) => (
                <td key={j} className={`px-3 py-2 ${mono?.includes(j) ? "font-mono tabular-nums" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <figcaption className="border-t border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-600">{caption}</figcaption>}
    </figure>
  );
}

export const CHEBI = (id: number) => `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${id}`;
export const IUPAC_WEIGHTS = "https://iupac.qmul.ac.uk/AtWt/";
export const CC_BY = "https://creativecommons.org/licenses/by/4.0/";
