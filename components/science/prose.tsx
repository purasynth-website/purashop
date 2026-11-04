import type { ReactNode } from "react";
import Link from "next/link";

/**
 * The handful of elements a primer is written with. Keeping them as components
 * (rather than a Markdown pipeline) means the primers can embed live numbers
 * from lib/mass.ts and lib/units.ts and the structure drawings directly.
 */

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[17px] leading-relaxed text-slate-700 first:mt-0">{children}</p>;
}

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mt-10 scroll-mt-24 font-display text-2xl font-bold tracking-tight text-navy-900">
      {children}
    </h2>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-slate-700 marker:text-cobalt-600">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

/** Inline code: a formula, a SMILES string, a unit. */
export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-cobalt-50 px-1.5 py-0.5 font-mono text-[0.92em] text-navy-900 ring-1 ring-cobalt-100">{children}</code>;
}

/** A worked calculation, one line per step, on a dark card. */
export function Calc({ lines, caption }: { lines: string[]; caption?: string }) {
  return (
    <figure className="mt-5 overflow-x-auto rounded-xl bg-navy-900 p-4 text-slate-100 shadow-sm">
      <pre className="font-mono text-[14px] leading-7">{lines.join("\n")}</pre>
      {caption && <figcaption className="mt-2 border-t border-white/10 pt-2 text-sm text-slate-300">{caption}</figcaption>}
    </figure>
  );
}

/** A short aside the reader can skip. */
export function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">{title}</p>
      <div className="mt-1 text-[15px] leading-relaxed text-slate-700">{children}</div>
    </aside>
  );
}

/** The takeaways, placed at the end of every primer. */
export function InShort({ items }: { items: ReactNode[] }) {
  return (
    <section className="mt-10 rounded-2xl border border-cobalt-100 bg-cobalt-50 px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cobalt-700">In short</p>
      <ol className="mt-3 space-y-2 text-[15px] leading-relaxed text-slate-800">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 font-mono text-xs font-semibold text-cobalt-700">{String(i + 1).padStart(2, "0")}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** A link to a source record, shown with its identifier. */
export function Source({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-cobalt-700 underline decoration-cobalt-200 underline-offset-2 hover:decoration-cobalt-700">
      {children}
    </a>
  );
}

/** An internal link to another primer or page. */
export function Ref({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-cobalt-700 underline decoration-cobalt-200 underline-offset-2 hover:decoration-cobalt-700">
      {children}
    </Link>
  );
}

/** A framed drawing with a caption. */
export function Drawing({ children, caption }: { children: ReactNode; caption: ReactNode }) {
  return (
    <figure className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-navy-900 shadow-sm">
      {children}
      <figcaption className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">{caption}</figcaption>
    </figure>
  );
}

/** A data table for the primers and the tables page. */
export function Table({ head, rows, caption, mono }: { head: ReactNode[]; rows: ReactNode[][]; caption?: string; mono?: number[] }) {
  return (
    <figure className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-[14px]">
        <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-800">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={`px-3 py-2 ${mono?.includes(j) ? "font-mono tabular-nums" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <figcaption className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">{caption}</figcaption>}
    </figure>
  );
}

export const CHEBI = (id: number) => `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${id}`;
export const IUPAC_WEIGHTS = "https://iupac.qmul.ac.uk/AtWt/";
export const GOLD_BOOK = "https://goldbook.iupac.org/";
export const CC_BY = "https://creativecommons.org/licenses/by/4.0/";
