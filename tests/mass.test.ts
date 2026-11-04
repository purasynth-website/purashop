import { describe, expect, it } from "vitest";
import {
  PROTON_MASS,
  RESIDUES,
  aminoAcidMass,
  formulaMass,
  hillFormula,
  normalizeSequence,
  parseFormula,
  peptideMass,
  residueMass,
} from "@/lib/mass";

describe("parseFormula / hillFormula", () => {
  it("reads a Hill-order formula", () => {
    expect(parseFormula("C6H13NO2")).toEqual({ C: 6, H: 13, N: 1, O: 2 });
    expect(parseFormula("H2O")).toEqual({ H: 2, O: 1 });
    expect(parseFormula("C3H5NOS")).toEqual({ C: 3, H: 5, N: 1, O: 1, S: 1 });
  });

  it("rejects what it cannot read", () => {
    expect(() => parseFormula("C6H13NaO2")).toThrow();
    expect(() => parseFormula("")).toThrow();
    expect(() => parseFormula("c6h13")).toThrow();
  });

  it("prints Hill order with a bare symbol for a count of one", () => {
    expect(hillFormula({ O: 2, N: 1, H: 13, C: 6 })).toBe("C6H13NO2");
    expect(hillFormula({ H: 2, O: 1 })).toBe("H2O");
  });
});

describe("formula masses — the numbers the explainers quote", () => {
  it("glycine: 75.03203 Da monoisotopic, 75.067 Da average", () => {
    const m = formulaMass("C2H5NO2");
    expect(m.mono).toBeCloseTo(75.03203, 5);
    expect(m.average).toBeCloseTo(75.067, 3);
  });

  it("leucine and isoleucine share C6H13NO2: 131.09463 Da monoisotopic", () => {
    const m = formulaMass("C6H13NO2");
    expect(m.mono).toBeCloseTo(131.09463, 5);
    expect(m.average).toBeCloseTo(131.175, 3);
  });

  it("water, glucose and caffeine", () => {
    expect(formulaMass("H2O").average).toBeCloseTo(18.015, 3);
    expect(formulaMass("H2O").mono).toBeCloseTo(18.01056, 5);
    expect(formulaMass("C6H12O6").average).toBeCloseTo(180.156, 3);
    expect(formulaMass("C6H12O6").mono).toBeCloseTo(180.06339, 5);
    expect(formulaMass("C8H10N4O2").mono).toBeCloseTo(194.08038, 5);
  });

  it("the proton mass is the textbook value", () => {
    expect(PROTON_MASS).toBeCloseTo(1.007276, 6);
  });
});

describe("residues", () => {
  it("lists the twenty proteinogenic amino acids once each", () => {
    expect(RESIDUES).toHaveLength(20);
    expect(new Set(RESIDUES.map((r) => r.one)).size).toBe(20);
    expect(new Set(RESIDUES.map((r) => r.three)).size).toBe(20);
  });

  it.each([
    ["G", 57.02146],
    ["A", 71.03711],
    ["S", 87.03203],
    ["P", 97.05276],
    ["V", 99.06841],
    ["T", 101.04768],
    ["C", 103.00919],
    ["L", 113.08406],
    ["I", 113.08406],
    ["N", 114.04293],
    ["D", 115.02694],
    ["Q", 128.05858],
    ["K", 128.09496],
    ["E", 129.04259],
    ["M", 131.04049],
    ["H", 137.05891],
    ["F", 147.06841],
    ["R", 156.10111],
    ["Y", 163.06333],
    ["W", 186.07931],
  ])("residue %s has the standard monoisotopic mass %f", (letter, mono) => {
    expect(residueMass(letter)!.mono).toBeCloseTo(mono, 4);
  });

  it("a free amino acid is its residue plus water", () => {
    expect(aminoAcidMass("G")!.mono).toBeCloseTo(75.03203, 5);
    expect(aminoAcidMass("L")!.mono).toBeCloseTo(131.09463, 5);
    expect(aminoAcidMass("x")).toBeNull();
  });
});

describe("peptideMass", () => {
  it("Gly-Ala-Gly: residues plus one water", () => {
    const p = peptideMass("GAG");
    expect(p.mono).toBeCloseTo(203.0906, 4);
    expect(p.average).toBeCloseTo(203.198, 3);
    expect(p.formula).toBe("C7H13N3O4");
    expect(p.length).toBe(3);
  });

  it("a single residue is the free amino acid", () => {
    expect(peptideMass("W").mono).toBeCloseTo(204.08988, 4);
    expect(peptideMass("W").formula).toBe("C11H12N2O2");
  });

  it("an empty sequence weighs nothing", () => {
    expect(peptideMass("")).toEqual({ mono: 0, average: 0, formula: "", length: 0 });
  });

  it("throws on an unknown letter", () => {
    expect(() => peptideMass("GAB")).toThrow(/B/);
  });
});

describe("normalizeSequence", () => {
  it("upper-cases, strips spacing and alignment noise, and names bad letters", () => {
    expect(normalizeSequence("gag")).toEqual({ sequence: "GAG", invalid: [] });
    expect(normalizeSequence("G A-G 12\n")).toEqual({ sequence: "GAG", invalid: [] });
    expect(normalizeSequence("GAZBG")).toEqual({ sequence: "GAZBG", invalid: ["Z", "B"] });
  });
});
