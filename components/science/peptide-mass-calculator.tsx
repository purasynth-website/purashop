"use client";

import { useMemo, useState } from "react";
import { Formula } from "@/components/science/structures";
import { PROTON_MASS, RESIDUES, fmt, normalizeSequence, peptideMass, residue, residueMass } from "@/lib/mass";

/**
 * Peptide mass from a one-letter sequence: unmodified, free termini, the sum of
 * the residues plus one water. Runs entirely in the browser; nothing is sent
 * anywhere.
 */
export function PeptideMassCalculator() {
  const [input, setInput] = useState("GAG");
  const { sequence, invalid } = useMemo(() => normalizeSequence(input), [input]);
  const valid = invalid.length === 0 && sequence.length > 0;
  const result = useMemo(() => (valid ? peptideMass(sequence) : null), [valid, sequence]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const ch of sequence) map.set(ch, (map.get(ch) ?? 0) + 1);
    return RESIDUES.filter((r) => map.has(r.one)).map((r) => ({ ...r, n: map.get(r.one)! }));
  }, [sequence]);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <label htmlFor="sequence" className="block text-xs font-semibold uppercase tracking-[0.18em] text-moss-700">
        Sequence (one-letter codes)
      </label>
      <textarea
        id="sequence"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        spellCheck={false}
        autoCapitalize="characters"
        className="mt-2 w-full resize-y rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-base uppercase tracking-wider text-moss-900 outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-200"
        placeholder="e.g. GAG"
      />
      <p className="mt-2 text-xs text-stone-500">
        Spaces, digits and dashes are ignored. {sequence.length} residue{sequence.length === 1 ? "" : "s"}.
      </p>

      {invalid.length > 0 && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200" role="alert">
          Not one of the twenty standard residues: {invalid.map((c) => `"${c}"`).join(", ")}.
        </p>
      )}

      {result && (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-moss-50 px-4 py-3 ring-1 ring-moss-100">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-moss-700">Monoisotopic mass</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums text-moss-900">
              {fmt(result.mono, 5)} <span className="text-sm font-normal text-stone-600">Da</span>
            </dd>
          </div>
          <div className="rounded-xl bg-moss-50 px-4 py-3 ring-1 ring-moss-100">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-moss-700">Average mass</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums text-moss-900">
              {fmt(result.average, 3)} <span className="text-sm font-normal text-stone-600">Da</span>
            </dd>
          </div>
          <div className="rounded-xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600">[M+H]+ (monoisotopic)</dt>
            <dd className="mt-1 font-mono text-lg tabular-nums text-moss-900">{fmt(result.mono + PROTON_MASS, 5)}</dd>
          </div>
          <div className="rounded-xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600">Molecular formula</dt>
            <dd className="mt-1 font-mono text-lg text-moss-900">
              <Formula>{result.formula}</Formula>
            </dd>
          </div>
        </dl>
      )}

      {result && counts.length > 0 && (
        <table className="mt-5 w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="py-1 font-semibold">Residue</th>
              <th className="py-1 font-semibold">Count</th>
              <th className="py-1 font-semibold">Mono each</th>
              <th className="py-1 font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {counts.map((r) => {
              const m = residueMass(r.one)!;
              return (
                <tr key={r.one}>
                  <td className="py-1.5 text-stone-800">
                    {residue(r.one)!.name} <span className="text-stone-500">({r.three})</span>
                  </td>
                  <td className="py-1.5 font-mono tabular-nums">{r.n}</td>
                  <td className="py-1.5 font-mono tabular-nums">{fmt(m.mono, 5)}</td>
                  <td className="py-1.5 font-mono tabular-nums">{fmt(m.mono * r.n, 5)}</td>
                </tr>
              );
            })}
            <tr>
              <td className="py-1.5 text-stone-800">Water (termini)</td>
              <td className="py-1.5 font-mono tabular-nums">1</td>
              <td className="py-1.5 font-mono tabular-nums">18.01056</td>
              <td className="py-1.5 font-mono tabular-nums">18.01056</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
