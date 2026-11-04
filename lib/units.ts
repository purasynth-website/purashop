/**
 * Bench arithmetic: solution preparation, dilution, mass ↔ moles and the SI
 * prefixes. Pure functions, no dependencies. Used by the "Making a solution"
 * and "Changing units" primers and by the solution calculator, so the worked
 * examples and the tool cannot disagree.
 */

export type ConcentrationUnit = "mol/L" | "mmol/L" | "µmol/L";
export type VolumeUnit = "L" | "mL" | "µL";

/** Multiply a value in the unit by this to get the SI base (mol/L or L). */
export const CONCENTRATION_FACTORS: Record<ConcentrationUnit, number> = { "mol/L": 1, "mmol/L": 1e-3, "µmol/L": 1e-6 };
export const VOLUME_FACTORS: Record<VolumeUnit, number> = { L: 1, mL: 1e-3, "µL": 1e-6 };

export const SI_PREFIXES: ReadonlyArray<{ symbol: string; name: string; factor: number }> = [
  { symbol: "k", name: "kilo", factor: 1e3 },
  { symbol: "", name: "(none)", factor: 1 },
  { symbol: "m", name: "milli", factor: 1e-3 },
  { symbol: "µ", name: "micro", factor: 1e-6 },
  { symbol: "n", name: "nano", factor: 1e-9 },
  { symbol: "p", name: "pico", factor: 1e-12 },
];

/**
 * Grams of solid to weigh out for `volumeL` litres at `molPerL`, for a solid
 * of molar mass `molarMass` (g/mol) and fractional `purity` (1 = 100%).
 * mass = c × V × M ÷ purity.
 */
export function massToWeigh(molPerL: number, volumeL: number, molarMass: number, purity = 1): number {
  if (!(purity > 0)) throw new RangeError("purity must be greater than zero");
  return (molPerL * volumeL * molarMass) / purity;
}

/** g/L ÷ g/mol = mol/L. (1 mg/mL is 1 g/L.) */
export function molarityFromMassConcentration(gPerL: number, molarMass: number): number {
  return gPerL / molarMass;
}

/** mol/L × g/mol = g/L. */
export function massConcentrationFromMolarity(molPerL: number, molarMass: number): number {
  return molPerL * molarMass;
}

/** c1·V1 = c2·V2, solved for the stock volume V1 (same units in and out). */
export function dilutionStockVolume(stock: number, target: number, finalVolume: number): number {
  if (!(stock > 0)) throw new RangeError("stock concentration must be greater than zero");
  return (target * finalVolume) / stock;
}

export function molesFromMass(grams: number, molarMass: number): number {
  return grams / molarMass;
}

/**
 * A number to `sig` significant figures, as it would be written by hand:
 * trailing zeros kept (they carry meaning), no exponent for ordinary sizes.
 */
export function toSignificant(n: number, sig: number): string {
  if (!Number.isFinite(n)) return "–";
  if (n === 0) return (0).toFixed(Math.max(sig - 1, 0));
  const s = n.toPrecision(sig);
  if (!/e/i.test(s)) return s;
  // toPrecision switched to exponent form (very large or very small): expand it.
  const [mantissa, exp] = s.split(/e/i);
  const e = Number(exp);
  if (e > 0) {
    const digits = mantissa.replace(".", "").replace("-", "");
    return (n < 0 ? "-" : "") + digits.padEnd(e + 1, "0");
  }
  const digits = mantissa.replace(".", "").replace("-", "");
  return (n < 0 ? "-" : "") + "0." + "0".repeat(-e - 1) + digits;
}

/** Choose g, mg or µg so the number reads comfortably, to `sig` figures. */
export function formatMass(grams: number, sig = 4): { value: string; unit: "g" | "mg" | "µg" } {
  const abs = Math.abs(grams);
  if (abs >= 1 || abs === 0) return { value: toSignificant(grams, sig), unit: "g" };
  if (abs >= 1e-3) return { value: toSignificant(grams * 1e3, sig), unit: "mg" };
  return { value: toSignificant(grams * 1e6, sig), unit: "µg" };
}

/** Choose mol, mmol, µmol or nmol the same way. */
export function formatMoles(mol: number, sig = 4): { value: string; unit: "mol" | "mmol" | "µmol" | "nmol" } {
  const abs = Math.abs(mol);
  if (abs >= 1 || abs === 0) return { value: toSignificant(mol, sig), unit: "mol" };
  if (abs >= 1e-3) return { value: toSignificant(mol * 1e3, sig), unit: "mmol" };
  if (abs >= 1e-6) return { value: toSignificant(mol * 1e6, sig), unit: "µmol" };
  return { value: toSignificant(mol * 1e9, sig), unit: "nmol" };
}
