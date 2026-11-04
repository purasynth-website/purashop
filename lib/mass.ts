/**
 * Molecular mass arithmetic: formulas, amino acid residues and peptide
 * sequences. Pure functions, no dependencies, used by the explainers, the
 * reference tables and the peptide mass tool so every number on the site is
 * computed from one set of constants rather than typed by hand.
 *
 * Average masses use the IUPAC abridged standard atomic weights (2021);
 * monoisotopic masses use the exact mass of each element's most abundant
 * isotope (12C, 1H, 14N, 16O, 32S). Databases that use more digits of the
 * standard atomic weight can differ from the average values here in the third
 * decimal place; monoisotopic values agree to five decimals.
 */
export const ATOMIC_MASS = {
  C: { mono: 12, average: 12.011, name: "Carbon" },
  H: { mono: 1.00782503, average: 1.008, name: "Hydrogen" },
  N: { mono: 14.00307401, average: 14.007, name: "Nitrogen" },
  O: { mono: 15.99491462, average: 15.999, name: "Oxygen" },
  S: { mono: 31.97207117, average: 32.06, name: "Sulfur" },
} as const;

export type Element = keyof typeof ATOMIC_MASS;
export type Composition = Partial<Record<Element, number>>;
export type Mass = { mono: number; average: number };

/** Mass of a proton, for the [M+H]+ ion a mass spectrometer reports. */
export const PROTON_MASS = 1.00727647;

const ELEMENTS = Object.keys(ATOMIC_MASS) as Element[];

function isElement(s: string): s is Element {
  return (ELEMENTS as string[]).includes(s);
}

/** "C6H13NO2" → { C: 6, H: 13, N: 1, O: 2 }. Throws on anything it cannot read. */
export function parseFormula(formula: string): Composition {
  const out: Composition = {};
  const re = /([A-Z][a-z]?)(\d*)/g;
  let consumed = 0;
  for (const m of formula.matchAll(re)) {
    if (m.index !== consumed) break;
    consumed += m[0].length;
    const [, symbol, count] = m;
    if (!isElement(symbol)) throw new Error(`Unknown element "${symbol}" in "${formula}"`);
    out[symbol] = (out[symbol] ?? 0) + (count ? Number(count) : 1);
  }
  if (consumed !== formula.length || formula.length === 0) {
    throw new Error(`Cannot read formula "${formula}"`);
  }
  return out;
}

export function addCompositions(...parts: Composition[]): Composition {
  const out: Composition = {};
  for (const part of parts) {
    for (const el of ELEMENTS) {
      const n = part[el];
      if (n) out[el] = (out[el] ?? 0) + n;
    }
  }
  return out;
}

/** Hill order: C first, then H, then the rest alphabetically. */
export function hillFormula(c: Composition): string {
  const order: Element[] = ["C", "H", ...ELEMENTS.filter((e) => e !== "C" && e !== "H").sort()];
  return order
    .filter((el) => (c[el] ?? 0) > 0)
    .map((el) => `${el}${c[el] === 1 ? "" : c[el]}`)
    .join("");
}

export function compositionMass(c: Composition): Mass {
  let mono = 0;
  let average = 0;
  for (const el of ELEMENTS) {
    const n = c[el] ?? 0;
    mono += n * ATOMIC_MASS[el].mono;
    average += n * ATOMIC_MASS[el].average;
  }
  return { mono, average };
}

export function formulaMass(formula: string): Mass {
  return compositionMass(parseFormula(formula));
}

export const WATER = parseFormula("H2O");

/**
 * The twenty proteinogenic amino acids. `formula` is the RESIDUE (the amino
 * acid minus one water), which is what a sequence is a sum of; the free amino
 * acid is the residue plus H2O.
 */
export const RESIDUES: ReadonlyArray<{ one: string; three: string; name: string; formula: string }> = [
  { one: "G", three: "Gly", name: "Glycine", formula: "C2H3NO" },
  { one: "A", three: "Ala", name: "Alanine", formula: "C3H5NO" },
  { one: "S", three: "Ser", name: "Serine", formula: "C3H5NO2" },
  { one: "P", three: "Pro", name: "Proline", formula: "C5H7NO" },
  { one: "V", three: "Val", name: "Valine", formula: "C5H9NO" },
  { one: "T", three: "Thr", name: "Threonine", formula: "C4H7NO2" },
  { one: "C", three: "Cys", name: "Cysteine", formula: "C3H5NOS" },
  { one: "L", three: "Leu", name: "Leucine", formula: "C6H11NO" },
  { one: "I", three: "Ile", name: "Isoleucine", formula: "C6H11NO" },
  { one: "N", three: "Asn", name: "Asparagine", formula: "C4H6N2O2" },
  { one: "D", three: "Asp", name: "Aspartic acid", formula: "C4H5NO3" },
  { one: "Q", three: "Gln", name: "Glutamine", formula: "C5H8N2O2" },
  { one: "K", three: "Lys", name: "Lysine", formula: "C6H12N2O" },
  { one: "E", three: "Glu", name: "Glutamic acid", formula: "C5H7NO3" },
  { one: "M", three: "Met", name: "Methionine", formula: "C5H9NOS" },
  { one: "H", three: "His", name: "Histidine", formula: "C6H7N3O" },
  { one: "F", three: "Phe", name: "Phenylalanine", formula: "C9H9NO" },
  { one: "R", three: "Arg", name: "Arginine", formula: "C6H12N4O" },
  { one: "Y", three: "Tyr", name: "Tyrosine", formula: "C9H9NO2" },
  { one: "W", three: "Trp", name: "Tryptophan", formula: "C11H10N2O" },
];

const RESIDUE_BY_LETTER = new Map(RESIDUES.map((r) => [r.one, r]));

export function residue(letter: string) {
  return RESIDUE_BY_LETTER.get(letter.toUpperCase()) ?? null;
}

export function residueMass(letter: string): Mass | null {
  const r = residue(letter);
  return r ? formulaMass(r.formula) : null;
}

/** Residue + water: the free amino acid. */
export function aminoAcidMass(letter: string): Mass | null {
  const r = residue(letter);
  return r ? compositionMass(addCompositions(parseFormula(r.formula), WATER)) : null;
}

/**
 * Upper-cases a typed sequence, drops whitespace and the digits/dashes people
 * paste from alignments, and reports any letter that is not one of the twenty.
 */
export function normalizeSequence(input: string): { sequence: string; invalid: string[] } {
  const cleaned = input.toUpperCase().replace(/[\s\d\-*.]/g, "");
  const invalid = Array.from(new Set(Array.from(cleaned).filter((ch) => !RESIDUE_BY_LETTER.has(ch))));
  return { sequence: cleaned, invalid };
}

/**
 * Mass of a linear, unmodified peptide with free termini: the residues plus
 * one water (the N-terminal H and the C-terminal OH). Throws on an unknown
 * letter; callers normalise first.
 */
export function peptideMass(sequence: string): Mass & { formula: string; length: number } {
  const parts: Composition[] = [];
  for (const ch of sequence) {
    const r = residue(ch);
    if (!r) throw new Error(`Unknown residue "${ch}"`);
    parts.push(parseFormula(r.formula));
  }
  const composition = addCompositions(...parts, sequence.length > 0 ? WATER : {});
  return { ...compositionMass(composition), formula: hillFormula(composition), length: sequence.length };
}

/** Fixed decimals, as a string, for display. */
export function fmt(n: number, decimals: number): string {
  return n.toFixed(decimals);
}
