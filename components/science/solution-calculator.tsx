"use client";

import { useMemo, useState } from "react";
import { Formula } from "@/components/science/structures";
import { formulaMass, hillFormula, parseFormula } from "@/lib/mass";
import {
  CONCENTRATION_FACTORS,
  VOLUME_FACTORS,
  formatMass,
  formatMoles,
  massToWeigh,
  toSignificant,
  type ConcentrationUnit,
  type VolumeUnit,
} from "@/lib/units";

/**
 * Mass to weigh for a target concentration and volume: c × V × M ÷ purity.
 * The solid can be given as a formula (molar mass computed) or as a molar mass
 * in g/mol. Runs entirely in the browser; nothing is sent anywhere.
 */

const CONC_UNITS = Object.keys(CONCENTRATION_FACTORS) as ConcentrationUnit[];
const VOL_UNITS = Object.keys(VOLUME_FACTORS) as VolumeUnit[];

const field =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-base text-navy-900 outline-none focus:border-cobalt-600 focus:ring-2 focus:ring-cobalt-100";
const labelCls = "block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600";

function resolveMolarMass(input: string): { molarMass: number; formula: string | null; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) return { molarMass: NaN, formula: null, error: "Enter a formula or a molar mass." };
  const asNumber = Number(trimmed);
  if (Number.isFinite(asNumber)) {
    return asNumber > 0 ? { molarMass: asNumber, formula: null, error: null } : { molarMass: NaN, formula: null, error: "Molar mass must be positive." };
  }
  try {
    const composition = parseFormula(trimmed);
    return { molarMass: formulaMass(trimmed).average, formula: hillFormula(composition), error: null };
  } catch {
    return { molarMass: NaN, formula: null, error: "Not a formula I can read (C, H, N, O and S only) and not a number." };
  }
}

export function SolutionCalculator() {
  const [solid, setSolid] = useState("C6H12O6");
  const [conc, setConc] = useState("100");
  const [concUnit, setConcUnit] = useState<ConcentrationUnit>("mmol/L");
  const [vol, setVol] = useState("250");
  const [volUnit, setVolUnit] = useState<VolumeUnit>("mL");
  const [purity, setPurity] = useState("100");

  const resolved = useMemo(() => resolveMolarMass(solid), [solid]);
  const c = Number(conc) * CONCENTRATION_FACTORS[concUnit];
  const v = Number(vol) * VOLUME_FACTORS[volUnit];
  const p = Number(purity) / 100;
  const inputsOk = Number.isFinite(c) && c > 0 && Number.isFinite(v) && v > 0 && Number.isFinite(p) && p > 0 && p <= 1;

  const grams = resolved.error === null && inputsOk ? massToWeigh(c, v, resolved.molarMass, p) : null;
  const moles = inputsOk ? c * v : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="solid" className={labelCls}>
            Solid: formula or molar mass (g/mol)
          </label>
          <input id="solid" value={solid} onChange={(e) => setSolid(e.target.value)} spellCheck={false} className={field} placeholder="C6H12O6 or 180.156" />
          <p className="mt-1 text-xs text-slate-500">
            {resolved.error ? (
              <span className="text-amber-800">{resolved.error}</span>
            ) : resolved.formula ? (
              <>
                <Formula>{resolved.formula}</Formula>, average molar mass {toSignificant(resolved.molarMass, 6)} g/mol
              </>
            ) : (
              <>Molar mass {toSignificant(resolved.molarMass, 6)} g/mol, as entered</>
            )}
          </p>
        </div>
        <div>
          <label htmlFor="conc" className={labelCls}>
            Target concentration
          </label>
          <div className="flex gap-2">
            <input id="conc" value={conc} onChange={(e) => setConc(e.target.value)} inputMode="decimal" className={field} />
            <select aria-label="Concentration unit" value={concUnit} onChange={(e) => setConcUnit(e.target.value as ConcentrationUnit)} className={`${field} w-32`}>
              {CONC_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="vol" className={labelCls}>
            Final volume
          </label>
          <div className="flex gap-2">
            <input id="vol" value={vol} onChange={(e) => setVol(e.target.value)} inputMode="decimal" className={field} />
            <select aria-label="Volume unit" value={volUnit} onChange={(e) => setVolUnit(e.target.value as VolumeUnit)} className={`${field} w-32`}>
              {VOL_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="purity" className={labelCls}>
            Stated purity (%)
          </label>
          <input id="purity" value={purity} onChange={(e) => setPurity(e.target.value)} inputMode="decimal" className={field} />
        </div>
      </div>

      {!inputsOk && <p className="mt-4 text-sm text-amber-800">Concentration and volume must be positive; purity between 0 and 100.</p>}

      {grams !== null && moles !== null && (
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-navy-900 px-4 py-3 text-white">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cobalt-200">Mass to weigh</dt>
            <dd className="mt-1 font-mono text-3xl font-semibold tabular-nums">
              {formatMass(grams).value} <span className="text-base font-normal text-slate-300">{formatMass(grams).unit}</span>
            </dd>
          </div>
          <div className="rounded-xl bg-cobalt-50 px-4 py-3 ring-1 ring-cobalt-100">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cobalt-700">Amount of substance</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums text-navy-900">
              {formatMoles(moles).value} <span className="text-sm font-normal text-slate-600">{formatMoles(moles).unit}</span>
            </dd>
          </div>
        </dl>
      )}

      {grams !== null && (
        <p className="mt-4 font-mono text-xs leading-6 text-slate-600">
          m = {toSignificant(c, 4)} mol/L × {toSignificant(v, 4)} L × {toSignificant(resolved.molarMass, 6)} g/mol
          {p < 1 ? ` ÷ ${toSignificant(p, 3)}` : ""} = {toSignificant(grams, 4)} g
        </p>
      )}
    </div>
  );
}
