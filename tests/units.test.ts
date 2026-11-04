import { describe, expect, it } from "vitest";
import { formulaMass } from "@/lib/mass";
import {
  CONCENTRATION_FACTORS,
  VOLUME_FACTORS,
  dilutionStockVolume,
  formatMass,
  formatMoles,
  massConcentrationFromMolarity,
  massToWeigh,
  molarityFromMassConcentration,
  molesFromMass,
  toSignificant,
} from "@/lib/units";

const GLUCOSE = formulaMass("C6H12O6").average; // 180.156

describe("massToWeigh — the worked example in the solution primer", () => {
  it("250 mL of 0.100 mol/L glucose needs 4.504 g", () => {
    expect(massToWeigh(0.1, 0.25, GLUCOSE)).toBeCloseTo(4.5039, 3);
  });

  it("a 98% pure solid needs 2% more, by division", () => {
    expect(massToWeigh(0.1, 0.25, GLUCOSE, 0.98)).toBeCloseTo(4.5039 / 0.98, 3);
    expect(() => massToWeigh(0.1, 0.25, GLUCOSE, 0)).toThrow(RangeError);
  });

  it("the unit factors turn mmol/L and mL into the base units", () => {
    const grams = massToWeigh(100 * CONCENTRATION_FACTORS["mmol/L"], 250 * VOLUME_FACTORS.mL, GLUCOSE);
    expect(grams).toBeCloseTo(4.5039, 3);
  });
});

describe("concentration conversions", () => {
  it("10 mg/mL of glucose is 55.5 mmol/L", () => {
    expect(molarityFromMassConcentration(10, GLUCOSE) * 1000).toBeCloseTo(55.51, 1);
  });

  it("1 mg/mL of glucose is 5.551 mmol/L, and back", () => {
    const molar = molarityFromMassConcentration(1, GLUCOSE);
    expect(molar * 1000).toBeCloseTo(5.551, 3);
    expect(massConcentrationFromMolarity(molar, GLUCOSE)).toBeCloseTo(1, 9);
  });

  it("c1V1 = c2V2: 50 mL of 0.020 mol/L from a 1.00 mol/L stock takes 1.0 mL", () => {
    expect(dilutionStockVolume(1.0, 0.02, 50)).toBeCloseTo(1.0, 9);
    expect(() => dilutionStockVolume(0, 0.02, 50)).toThrow(RangeError);
  });

  it("50 µg of glucose is 277.5 nmol", () => {
    expect(molesFromMass(50e-6, GLUCOSE) * 1e9).toBeCloseTo(277.5, 1);
  });
});

describe("toSignificant / formatMass / formatMoles", () => {
  it("rounds to significant figures and keeps meaningful trailing zeros", () => {
    expect(toSignificant(4.5039, 4)).toBe("4.504");
    expect(toSignificant(4.5, 3)).toBe("4.50");
    expect(toSignificant(0.0002775, 3)).toBe("0.000278");
    expect(toSignificant(277500, 4)).toBe("277500");
    expect(toSignificant(0, 3)).toBe("0.00");
  });

  it("picks a readable mass unit", () => {
    expect(formatMass(4.5039)).toEqual({ value: "4.504", unit: "g" });
    expect(formatMass(0.0045039)).toEqual({ value: "4.504", unit: "mg" });
    expect(formatMass(2.3e-6)).toEqual({ value: "2.300", unit: "µg" });
  });

  it("picks a readable amount unit", () => {
    expect(formatMoles(0.025)).toEqual({ value: "25.00", unit: "mmol" });
    expect(formatMoles(2.775e-7)).toEqual({ value: "277.5", unit: "nmol" });
  });
});
