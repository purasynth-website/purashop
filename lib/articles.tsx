import type { ReactNode } from "react";
import { Formula, GlycineStructure, IsoleucineStructure, LeucineStructure } from "@/components/science/structures";
import {
  CC_BY,
  CHEBI,
  Calc,
  Code,
  Drawing,
  GOLD_BOOK,
  H2,
  IUPAC_WEIGHTS,
  InShort,
  LI,
  Note,
  P,
  Ref,
  Source,
  Table,
  UL,
} from "@/components/science/prose";
import { PATHS, articlePath } from "@/lib/blog";
import { ATOMIC_MASS, PROTON_MASS, RESIDUES, fmt, formulaMass, peptideMass, residueMass } from "@/lib/mass";
import { SI_PREFIXES, dilutionStockVolume, massToWeigh, molarityFromMassConcentration, molesFromMass, toSignificant } from "@/lib/units";

/**
 * The primer bodies, keyed by slug (the index is lib/blog.ts). Every number
 * is computed by lib/mass.ts and lib/units.ts at render time so the text can
 * never drift from the tables or the calculators.
 */

const gly = formulaMass("C2H5NO2");
const leu = formulaMass("C6H13NO2");
const water = formulaMass("H2O");
const glucose = formulaMass("C6H12O6");
const glucoseHydrate = formulaMass("C6H14O7");
const gag = peptideMass("GAG");

const GLUCOSE_MASS = massToWeigh(0.1, 0.25, glucose.average);

const P01 = articlePath("what-a-mole-counts");
const P02 = articlePath("making-a-solution-to-a-target-concentration");
const P04 = articlePath("significant-figures-and-what-a-balance-can-promise");
const P05 = articlePath("two-masses-one-molecule");
const P07 = articlePath("reading-a-line-drawing");
const P08 = articlePath("same-formula-different-substance");

function ResidueTable() {
  return (
    <Table
      head={["Residue", "", "Residue formula", "Monoisotopic (Da)", "Average (Da)"]}
      mono={[2, 3, 4]}
      rows={RESIDUES.map((r) => {
        const m = residueMass(r.one)!;
        return [r.name, `${r.three} · ${r.one}`, <Formula key={r.one}>{r.formula}</Formula>, fmt(m.mono, 5), fmt(m.average, 3)];
      })}
      caption="Residue = amino acid − H2O. Monoisotopic from the exact masses of 12C, 1H, 14N, 16O and 32S; average from the IUPAC abridged standard atomic weights."
    />
  );
}

/* 01 ─────────────────────────────────────────────────────────────────────── */
const WhatAMoleCounts = () => (
  <>
    <P>
      A mole is a count, not a weight. It is 6.02214076 × 10<sup>23</sup> of something — molecules, atoms, ions, electrons — in exactly the way a
      dozen is twelve of something. Most of the confusion around molar mass, molecular mass and molecular weight disappears once that is fixed in
      place.
    </P>
    <H2>The count</H2>
    <P>
      The number was chosen so that the arithmetic of the bench lines up with the arithmetic of the molecule. One carbon-12 atom has a mass of
      exactly 12 daltons; one mole of carbon-12 atoms has a mass of almost exactly 12 grams. Whatever a single molecule weighs in daltons, a mole of
      them weighs in grams. The unit was defined to make that true.
    </P>
    <H2>Molar mass: the mass of the count</H2>
    <P>
      Molar mass is the mass of one mole of a substance, in grams per mole (g/mol). It is the number you use at the bench: it turns a target amount
      in moles into a mass you can weigh, and a weighed mass back into moles. Water is {fmt(water.average, 3)} g/mol.
    </P>
    <H2>Molecular mass: the mass of one</H2>
    <P>
      Molecular mass is the mass of a single molecule, in daltons (Da), also written u. For water that is {fmt(water.average, 3)} Da. The same digits
      as the molar mass, by the design above, and a different unit, because it answers a different question: one molecule, not a mole of them.
    </P>
    <H2>Molecular weight: the older word</H2>
    <P>
      Strictly a <em>relative</em> molecular mass, the ratio of the molecule’s mass to one dalton, and so a bare number with no unit. In everyday use
      “molecular weight” and “MW” mean molar mass, and a label reading MW 180.16 is read as 180.16 g/mol by everyone, without harm.
    </P>
    <H2>Worked example: glucose</H2>
    <P>
      Count the atoms in <Code>C6H12O6</Code>, multiply each count by that element’s standard atomic weight, and add.
    </P>
    <Calc
      lines={[
        `C   6 × ${ATOMIC_MASS.C.average}  =  ${fmt(6 * ATOMIC_MASS.C.average, 3)}`,
        `H  12 × ${ATOMIC_MASS.H.average}   =  ${fmt(12 * ATOMIC_MASS.H.average, 3)}`,
        `O   6 × ${ATOMIC_MASS.O.average}  =  ${fmt(6 * ATOMIC_MASS.O.average, 3)}`,
        `                    ───────`,
        `                    ${fmt(glucose.average, 3)} g/mol`,
      ]}
      caption="Standard atomic weights from IUPAC. A data sheet using more decimal places lands within a few thousandths of this."
    />
    <P>
      That is the average molar mass, the one for weighing. A mass spectrometer reports {fmt(glucose.mono, 5)} Da instead, because it sees one
      isotopic species at a time; <Ref href={P05}>Two masses, one molecule</Ref> explains the gap. To turn this number into a mass for a given volume
      and concentration, see <Ref href={P02}>Making a solution to a target concentration</Ref>.
    </P>
    <Note title="Where the atomic weights come from">
      The standard atomic weights are published by IUPAC’s Commission on Isotopic Abundances and Atomic Weights (<Source href={IUPAC_WEIGHTS}>current table</Source>).
      For carbon, hydrogen, nitrogen and oxygen they are intervals, because the isotope mix varies slightly with the source of the sample; the single
      “abridged” value is what calculations use. The definitions themselves are in the <Source href={GOLD_BOOK}>IUPAC Gold Book</Source>.
    </Note>
    <InShort
      items={[
        <>A mole is 6.02214076 × 10<sup>23</sup> things. Molar mass is what that many weigh, in g/mol.</>,
        <>Molecular mass is one molecule, in Da. Same digits, by design.</>,
        <>“Molecular weight” is the informal name for either, strictly a unitless ratio.</>,
      ]}
    />
  </>
);

/* 02 ─────────────────────────────────────────────────────────────────────── */
const MakingASolution = () => (
  <>
    <P>
      Every “make 250 mL of 0.100 mol/L” problem is the same three-way multiplication, and most of the mistakes come from a unit slipping in one of
      the three factors rather than from the chemistry.
    </P>
    <H2>The three factors</H2>
    <P>
      Concentration (mol/L) × volume (L) × molar mass (g/mol) = mass (g). Litres cancel, moles cancel, grams remain. Write the units next to the
      numbers and the equation checks itself.
    </P>
    <H2>Worked example: glucose</H2>
    <Calc
      lines={[
        `c   0.100 mol/L`,
        `V   0.250 L          (250 mL)`,
        `M   ${fmt(glucose.average, 3)} g/mol    (C6H12O6, anhydrous)`,
        ``,
        `m = 0.100 × 0.250 × ${fmt(glucose.average, 3)} = ${toSignificant(GLUCOSE_MASS, 4)} g`,
      ]}
      caption="The litres and the moles cancel; grams are what is left."
    />
    <P>
      Weigh {toSignificant(GLUCOSE_MASS, 4)} g of anhydrous glucose, dissolve it in less than 250 mL of water, then make up to the 250 mL mark.
      “Make up to volume” matters: adding 250 mL of water <em>to</em> the solid gives slightly more than 250 mL of solution.
    </P>
    <H2>What you are actually weighing</H2>
    <UL>
      <LI>
        <strong>Hydrates.</strong> Glucose is also sold as the monohydrate, <Code>C6H12O6·H2O</Code>, molar mass {fmt(glucoseHydrate.average, 3)} g/mol:
        each formula unit brings a water with it. Using {fmt(glucose.average, 3)} for the monohydrate under-doses by{" "}
        {fmt((1 - glucose.average / glucoseHydrate.average) * 100, 0)}%. The molar mass on the container is the one to use.
      </LI>
      <LI>
        <strong>Purity.</strong> A solid stated as 98% pure needs more, and the correction is a division, not a 2% addition: {toSignificant(GLUCOSE_MASS, 4)} g ÷ 0.98 ={" "}
        {toSignificant(massToWeigh(0.1, 0.25, glucose.average, 0.98), 4)} g for the example.
      </LI>
      <LI>
        <strong>Salts.</strong> A hydrochloride weighs more per mole of the parent compound than the free base does. Again, use the molar mass of
        the form in the bottle.
      </LI>
    </UL>
    <H2>Other ways concentration is written</H2>
    <UL>
      <LI>
        <strong>Mass concentration</strong>, g/L or mg/mL (1 mg/mL = 1 g/L). Divide by the molar mass to get molarity: 10 mg/mL of glucose is 10 g/L ÷{" "}
        {fmt(glucose.average, 3)} g/mol = {toSignificant(molarityFromMassConcentration(10, glucose.average), 3)} mol/L ={" "}
        {toSignificant(molarityFromMassConcentration(10, glucose.average) * 1000, 3)} mmol/L.
      </LI>
      <LI>
        <strong>Percent w/v.</strong> 1% w/v means 1 g per 100 mL, which is 10 g/L or 10 mg/mL.
      </LI>
      <LI>
        <strong>Dilutions.</strong> c<sub>1</sub>V<sub>1</sub> = c<sub>2</sub>V<sub>2</sub>. For 50 mL of 0.020 mol/L from a 1.00 mol/L stock: V
        <sub>1</sub> = 0.020 × 50 ÷ 1.00 = {toSignificant(dilutionStockVolume(1, 0.02, 50), 2)} mL of stock, made up to 50 mL.
      </LI>
    </UL>
    <Note title="How many digits to keep">
      The computed {fmt(GLUCOSE_MASS, 4)} g is only as good as the balance and the flask. <Ref href={P04}>Significant figures and what a balance can
      promise</Ref> is about where to stop.
    </Note>
    <P>
      The <Ref href={`${PATHS.calculators}#solution`}>solution calculator</Ref> does this multiplication for any formula or molar mass, with the
      purity correction.
    </P>
    <InShort
      items={[
        <>mass (g) = c (mol/L) × V (L) × M (g/mol). Carry the units and it checks itself.</>,
        <>Use the molar mass of what is in the bottle: hydrate, salt, or free compound.</>,
        <>Purity corrects by division. Make up to volume; do not add the volume.</>,
      ]}
    />
  </>
);

/* 03 ─────────────────────────────────────────────────────────────────────── */
const ChangingUnits = () => (
  <>
    <P>
      Unit conversions go wrong in one of two ways: a factor of a thousand in the wrong direction, or a conversion that needs a molar mass done
      without one. Both are caught by the same habit: carry the units through the arithmetic as if they were numbers.
    </P>
    <H2>Multiply by one</H2>
    <P>
      A ratio of two equal quantities is equal to one, and multiplying by one changes nothing but the unit. 2.5 mg × (1000 µg ÷ 1 mg) = 2500 µg. The
      mg cancels on paper, so the direction of the factor is never in doubt. Set every conversion up this way and the thousand-fold slips stop.
    </P>
    <H2>The prefixes</H2>
    <Table
      head={["Prefix", "Symbol", "Factor"]}
      mono={[1, 2]}
      rows={SI_PREFIXES.map((p) => [p.name, p.symbol || "–", p.factor >= 1 ? `×${p.factor.toLocaleString("en-US")}` : `×10^${Math.round(Math.log10(p.factor))}`])}
      caption="Each step down the table is a factor of a thousand. The symbol µ (micro) is often typed as a plain u."
    />
    <H2>Mass to moles needs a molar mass</H2>
    <P>
      Grams and moles are different kinds of quantity, so no prefix table converts between them; the molar mass is the bridge. 50 µg of glucose:
    </P>
    <Calc
      lines={[
        `50 µg × (1 g ÷ 10⁶ µg) = 5.0 × 10⁻⁵ g`,
        `5.0 × 10⁻⁵ g ÷ ${fmt(glucose.average, 3)} g/mol = ${molesFromMass(50e-6, glucose.average).toExponential(3)} mol`,
        `= ${toSignificant(molesFromMass(50e-6, glucose.average) * 1e9, 4)} nmol`,
      ]}
    />
    <H2>Concentrations</H2>
    <UL>
      <LI>
        <strong>mg/mL → mmol/L.</strong> 1 mg/mL is 1 g/L; divide by the molar mass for mol/L; multiply by 1000 for mmol/L. In one step: mmol/L =
        mg/mL × 1000 ÷ M. For glucose, 1 mg/mL = 1000 ÷ {fmt(glucose.average, 3)} = {toSignificant(molarityFromMassConcentration(1, glucose.average) * 1000, 4)}{" "}
        mmol/L.
      </LI>
      <LI>
        <strong>mmol/L → mg/mL.</strong> The reverse: mg/mL = mmol/L × M ÷ 1000.
      </LI>
      <LI>
        <strong>Percent w/v → mg/mL.</strong> Multiply by 10: a 2% w/v solution is 20 mg/mL.
      </LI>
      <LI>
        <strong>ppm.</strong> For dilute aqueous solutions, 1 ppm ≈ 1 mg/L ≈ 1 µg/mL.
      </LI>
    </UL>
    <H2>Two slips worth naming</H2>
    <UL>
      <LI>
        µ and m look alike in handwriting, and “u” is often typed for µ. A factor of a thousand hides there; read a handwritten unit twice.
      </LI>
      <LI>
        Dividing by a thousand when you meant to multiply. 250 µL is 0.250 mL, not 250 000 mL. If the result is absurd, the factor went the wrong way.
      </LI>
    </UL>
    <InShort
      items={[
        <>Write the units with the numbers and multiply by ratios equal to one. The units cancel; the direction is never in doubt.</>,
        <>Prefixes step by a thousand. Mass to moles is not a prefix; it needs the molar mass.</>,
        <>mmol/L = mg/mL × 1000 ÷ M.</>,
      ]}
    />
  </>
);

/* 04 ─────────────────────────────────────────────────────────────────────── */
const SignificantFigures = () => (
  <>
    <P>
      A calculation gives you as many digits as you like; an instrument gives you a fixed number of them. Reporting more digits than the instrument
      can support is the most common way a correct calculation turns into a misleading number.
    </P>
    <H2>Readability is not accuracy</H2>
    <P>
      A balance that displays 0.001 g has a readability of 1 mg. That is the size of its last step, not a promise about accuracy; the manufacturer’s
      specification and the balance’s calibration say how close the display is to the truth. A reading of 4.504 g on such a balance means the mass is
      4.504 g give or take a few milligrams, at best.
    </P>
    <H2>Counting significant figures</H2>
    <UL>
      <LI>All non-zero digits count: 4.504 has four.</LI>
      <LI>Zeros between non-zero digits count: {fmt(glucose.average, 3)} has six.</LI>
      <LI>Leading zeros do not: 0.0025 has two.</LI>
      <LI>Trailing zeros after a decimal point do count: 4.500 has four, and says the balance read to the milligram.</LI>
    </UL>
    <H2>Carrying them through a calculation</H2>
    <UL>
      <LI>
        <strong>Multiplying or dividing:</strong> the result keeps as many significant figures as the least precise input. 0.100 mol/L × 0.250 L ×{" "}
        {fmt(glucose.average, 3)} g/mol: the first two factors have three, so the honest result is {toSignificant(GLUCOSE_MASS, 3)} g, not{" "}
        {fmt(GLUCOSE_MASS, 4)} g.
      </LI>
      <LI>
        <strong>Adding or subtracting:</strong> the result keeps the coarsest decimal place of the inputs. {fmt(glucose.average, 3)} + {fmt(water.average, 3)} ={" "}
        {fmt(glucoseHydrate.average, 3)}, all to three decimals.
      </LI>
      <LI>
        <strong>Round once, at the end.</strong> Rounding intermediate results compounds the error.
      </LI>
    </UL>
    <H2>Constants are not the limit</H2>
    <P>
      Standard atomic weights are known to more figures than any bench measurement needs; it is the volume and the concentration you can actually
      achieve that set the precision. A 250 mL Class A volumetric flask is good to about ±0.15 mL, roughly 0.06%, so three or four significant figures
      in the final concentration is honest and five is not.
    </P>
    <Note title="On the numbers printed here">
      Monoisotopic masses on this site are printed to five decimals because the isotope masses are known that well; average masses to three, because
      the atomic weights are intervals. Printing a figure is not a claim that anyone can weigh to it.
    </Note>
    <InShort
      items={[
        <>Readability is the last digit on the display; accuracy is a separate specification.</>,
        <>Multiplication keeps the fewest significant figures; addition keeps the coarsest decimal place.</>,
        <>Round once, at the end, to what the instrument and the glassware can support.</>,
      ]}
    />
  </>
);

/* 05 ─────────────────────────────────────────────────────────────────────── */
const TwoMasses = () => (
  <>
    <P>
      Glycine is {fmt(gly.average, 3)} Da on one line of a data sheet and {fmt(gly.mono, 5)} Da on the next. Neither is a typo. The two numbers answer
      different questions, and the difference between them is isotopes.
    </P>
    <H2>Isotopes</H2>
    <P>
      Natural carbon is about 98.9% carbon-12 and 1.1% carbon-13. Hydrogen, nitrogen and oxygen each have a heavier minor isotope too. A sample of any
      compound is therefore a mixture of molecules with slightly different masses, depending on which isotopes each one happens to contain.
    </P>
    <H2>Average mass: the mixture</H2>
    <P>
      The mass per molecule of the natural mixture, using each element’s <strong>standard atomic weight</strong>, the abundance-weighted mean over its
      isotopes. This is the number a balance agrees with, the one molar mass is built on, and the one to use for weighing out a sample.
    </P>
    <H2>Monoisotopic mass: one molecule</H2>
    <P>
      The mass of one specific molecule made entirely of each element’s <strong>most abundant isotope</strong>: every carbon a carbon-12, every hydrogen
      a hydrogen-1, and so on. It is what a high-resolution mass spectrometer reports as the first, and for a small molecule the tallest, peak.
      “Exact mass” almost always means this.
    </P>
    <H2>Nominal mass: the integer</H2>
    <P>
      The whole-number version, using integer isotope masses (C = 12, H = 1, N = 14, O = 16). Glycine is 75. Useful for a quick check, too coarse for
      anything else.
    </P>
    <H2>Glycine, both ways</H2>
    <Calc
      lines={[
        `                 monoisotopic                  average`,
        `C  2 ×  ${ATOMIC_MASS.C.mono.toFixed(8)}  = ${fmt(2 * ATOMIC_MASS.C.mono, 5)}     2 × ${ATOMIC_MASS.C.average}  = ${fmt(2 * ATOMIC_MASS.C.average, 3)}`,
        `H  5 ×   ${ATOMIC_MASS.H.mono.toFixed(8)}  =  ${fmt(5 * ATOMIC_MASS.H.mono, 5)}     5 ×  ${ATOMIC_MASS.H.average}  =  ${fmt(5 * ATOMIC_MASS.H.average, 3)}`,
        `N  1 ×  ${ATOMIC_MASS.N.mono.toFixed(8)}  = ${fmt(ATOMIC_MASS.N.mono, 5)}     1 × ${ATOMIC_MASS.N.average}  = ${fmt(ATOMIC_MASS.N.average, 3)}`,
        `O  2 ×  ${ATOMIC_MASS.O.mono.toFixed(8)}  = ${fmt(2 * ATOMIC_MASS.O.mono, 5)}     2 × ${ATOMIC_MASS.O.average}  = ${fmt(2 * ATOMIC_MASS.O.average, 3)}`,
        `                                 ────────                     ───────`,
        `                                 ${fmt(gly.mono, 5)} Da                  ${fmt(gly.average, 3)} Da`,
      ]}
      caption="The monoisotopic column uses exact isotope masses; the average column uses the IUPAC abridged standard atomic weights."
    />
    <H2>When the gap matters</H2>
    <UL>
      <LI>For a small molecule the two differ by a few hundredths of a dalton. Either rounds to the same integer.</LI>
      <LI>
        For a peptide of a few thousand daltons the gap is about one dalton, and the monoisotopic peak is no longer the tallest: a molecule with one or
        two carbon-13 atoms becomes more likely than one with none.
      </LI>
      <LI>For a protein, the monoisotopic peak is too small to see; only the average mass is practical.</LI>
    </UL>
    <Note title="Which one to quote">
      Weighing, concentrations and molar mass: average. Mass spectrometry, formula assignment and anything labelled “exact”: monoisotopic. A data
      sheet that gives both, and names the atomic weights it used, is doing it right.
    </Note>
    <InShort
      items={[
        <>Average mass is the natural isotope mixture, what a balance measures. Monoisotopic is all-lightest-isotope, what a mass spectrometer measures.</>,
        <>“Exact mass” means monoisotopic. Nominal mass is the integer.</>,
        <>The gap grows with size: negligible for small molecules, about a dalton per few thousand daltons.</>,
      ]}
    />
  </>
);

/* 06 ─────────────────────────────────────────────────────────────────────── */
const ArithmeticOfChains = () => (
  <>
    <P>
      Look up glycine and you find {fmt(gly.mono, 5)} Da. Look up a glycine inside a peptide chain and you find {fmt(residueMass("G")!.mono, 5)} Da. Both
      are right. The second number is what sequences are built from, and the difference between them is exactly one water molecule.
    </P>
    <H2>A residue is an amino acid minus water</H2>
    <P>
      When two amino acids join, the carboxyl group of one and the amino group of the other form a peptide bond and release H<sub>2</sub>O. Each amino
      acid in the chain has therefore lost a water’s worth of atoms, and what is left of it is called a <strong>residue</strong>. For glycine,{" "}
      <Code>C2H5NO2</Code> becomes <Code>C2H3NO</Code>.
    </P>
    <Calc
      lines={[
        `glycine            C2H5NO2   ${fmt(gly.mono, 5)} Da`,
        `− water            H2O       ${fmt(water.mono, 5)} Da`,
        `= glycine residue  C2H3NO    ${fmt(residueMass("G")!.mono, 5)} Da`,
      ]}
      caption="Monoisotopic masses."
    />
    <H2>Adding up a chain</H2>
    <P>
      A linear peptide with ordinary free ends is the sum of its residues <em>plus one water</em>: the chain still carries a hydrogen at the N-terminus
      and a hydroxyl at the C-terminus that no bond consumed. For Gly-Ala-Gly:
    </P>
    <Calc
      lines={[
        `Gly  ${fmt(residueMass("G")!.mono, 5)}`,
        `Ala  ${fmt(residueMass("A")!.mono, 5)}`,
        `Gly  ${fmt(residueMass("G")!.mono, 5)}`,
        `H2O  ${fmt(water.mono, 5)}`,
        `───────────────`,
        `     ${fmt(gag.mono, 5)} Da   (${gag.formula})`,
      ]}
      caption={`Average mass by the same route: ${fmt(gag.average, 3)} Da.`}
    />
    <P>
      A mass spectrometer does not report the neutral molecule. It reports an ion, most often the molecule plus a proton, [M+H]<sup>+</sup>, which
      adds {fmt(PROTON_MASS, 5)} Da; for Gly-Ala-Gly that is {fmt(gag.mono + PROTON_MASS, 4)}. Modifications change the sum too: a disulfide bridge
      removes two hydrogens, an amidated C-terminus swaps OH for NH<sub>2</sub>. The{" "}
      <Ref href={`${PATHS.calculators}#peptide`}>sequence mass calculator</Ref> does the unmodified arithmetic for any sequence.
    </P>
    <H2>The twenty residues</H2>
    <ResidueTable />
    <Note title="Two identical rows">
      Leucine and isoleucine share every value in that table to five decimals. They have the same formula and differ only in how the atoms are
      connected, so no mass measurement can tell them apart. <Ref href={P08}>Same formula, different substance</Ref> is about exactly this.
    </Note>
    <InShort
      items={[
        <>Residue = amino acid − H<sub>2</sub>O. Sequences are sums of residues.</>,
        <>Peptide mass = residues + one water, for free termini and no modifications.</>,
        <>Measured values are ions: add a proton for [M+H]<sup>+</sup>.</>,
      ]}
    />
  </>
);

/* 07 ─────────────────────────────────────────────────────────────────────── */
const ReadingALineDrawing = () => (
  <>
    <P>
      A skeletal formula is a compression scheme. It leaves out the atoms that are everywhere, carbon and the hydrogens attached to carbon, so that
      what is unusual about a molecule stands out. Five rules are enough to read one.
    </P>
    <H2>Rule 1 — every corner and every line end is a carbon</H2>
    <P>
      Bonds are drawn as lines. Where two lines meet, or where a line simply stops, there is a carbon atom that is not written. A zigzag of four
      segments is a chain of five carbons.
    </P>
    <H2>Rule 2 — hydrogens on carbon are implied</H2>
    <P>
      Carbon makes four bonds. Count the lines reaching a corner; whatever is missing from four is hydrogen. A corner with two lines is a CH<sub>2</sub>,
      a line end is a CH<sub>3</sub>.
    </P>
    <H2>Rule 3 — anything that is not carbon is written</H2>
    <P>
      Nitrogen, oxygen and sulfur appear as their symbols, usually with their own hydrogens attached: OH, NH<sub>2</sub>, SH. A double bond is two
      parallel lines.
    </P>
    <Drawing
      caption={
        <>
          Glycine. One corner (a CH<sub>2</sub>), one line end that is a carbon carrying a double-bonded O and an OH, and an NH<sub>2</sub>. Count it up:{" "}
          <Formula>C2H5NO2</Formula>. Source structure: <Source href={CHEBI(15428)}>CHEBI:15428</Source>.
        </>
      }
    >
      <div className="mx-auto max-w-xs">
        <GlycineStructure className="w-full" title="Glycine, skeletal formula: H2N–CH2–COOH" />
      </div>
    </Drawing>
    <H2>Rule 4 — wedges show depth</H2>
    <P>
      A flat drawing cannot show that a carbon with four different neighbours is a three-dimensional centre. A <strong>filled wedge</strong> means the
      bond comes toward you; a <strong>hashed wedge</strong> means it goes away. Where it matters, the configuration is also named in the text: (S) or
      (R) for each such centre, L or D for amino acids and sugars.
    </P>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <Drawing
        caption={
          <>
            <strong>L-Leucine</strong>, (2S). One stereocentre, the carbon carrying NH<sub>2</sub>. <Source href={CHEBI(15603)}>CHEBI:15603</Source>
          </>
        }
      >
        <LeucineStructure className="w-full" title="L-leucine, skeletal formula with the amino group on a filled wedge" />
      </Drawing>
      <Drawing
        caption={
          <>
            <strong>L-Isoleucine</strong>, (2S,3S). Two stereocentres: the NH<sub>2</sub> carbon and the branching carbon beside it.{" "}
            <Source href={CHEBI(17191)}>CHEBI:17191</Source>
          </>
        }
      >
        <IsoleucineStructure className="w-full" title="L-isoleucine, skeletal formula with the amino group on a filled wedge and the branch methyl on a hashed wedge" />
      </Drawing>
    </div>
    <H2>Rule 5 — charges are written, and a drawing is one form</H2>
    <P>
      An amino acid in water exists mostly as a <em>zwitterion</em>: NH<sub>3</sub><sup>+</sup> at one end, COO<sup>−</sup> at the other. Drawings
      usually show the neutral form because it is simpler and the mass is identical. If a charge matters, it is written as a superscript beside the
      atom that carries it.
    </P>
    <Note title="The same drawing as text">
      A SMILES string encodes the same drawing as characters. Glycine is <Code>NCC(=O)O</Code>; L-leucine is <Code>CC(C)C[C@H](N)C(=O)O</Code>;
      L-isoleucine is <Code>CC[C@H](C)[C@H](N)C(=O)O</Code>. The <Code>@</Code> marks carry the wedge information.
    </Note>
    <InShort
      items={[
        <>Corners and line ends are carbons; missing bonds to four are hydrogens.</>,
        <>Everything else is written: N, O, S and their hydrogens, double bonds, charges.</>,
        <>Wedges are the only depth information. Without them a drawing cannot distinguish mirror-image forms.</>,
      ]}
    />
  </>
);

/* 08 ─────────────────────────────────────────────────────────────────────── */
const SameFormulaDifferentSubstance = () => (
  <>
    <P>
      Two compounds can share a formula to the last atom and still be different things. Leucine and isoleucine are the standard example:{" "}
      <Formula>C6H13NO2</Formula> both, {fmt(leu.mono, 5)} Da both, and no balance or mass spectrometer can tell them apart. What separates them is wiring and
      geometry.
    </P>
    <Drawing
      caption={
        <>
          The branch is one carbon further along in leucine. Structures after <Source href={CHEBI(15603)}>CHEBI:15603</Source> and{" "}
          <Source href={CHEBI(17191)}>CHEBI:17191</Source> (<Source href={CC_BY}>CC BY 4.0</Source>), redrawn.
        </>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <LeucineStructure className="w-full max-w-[240px]" title="L-leucine" />
          <p className="mt-1 text-sm font-semibold">L-Leucine</p>
          <p className="text-xs text-slate-500">(2S)</p>
        </div>
        <div>
          <IsoleucineStructure className="w-full max-w-[240px]" title="L-isoleucine" />
          <p className="mt-1 text-sm font-semibold">L-Isoleucine</p>
          <p className="text-xs text-slate-500">(2S,3S)</p>
        </div>
      </div>
    </Drawing>
    <H2>Constitutional isomers: different wiring</H2>
    <P>
      In leucine the side chain branches at its second carbon; in isoleucine it branches at the first. Same atoms, different connections. They are
      different compounds with different biochemistry, and only the connectivity can tell them apart.
    </P>
    <H2>Stereoisomers: different geometry</H2>
    <P>
      Fix the connectivity and there is still more than one molecule. Leucine has one stereocentre and therefore two mirror-image forms, L and D.
      Isoleucine has two stereocentres and four stereoisomers, of which only (2S,3S) is the one found in proteins. A drawing without wedges, or a
      SMILES without <Code>@</Code>, describes all of them at once.
    </P>
    <H2>One substance, several spellings</H2>
    <P>
      Even one specific molecule can be written several ways. The neutral form and the zwitterion are the same substance. Two SMILES strings can
      encode the same structure in different orders. This is why databases assign a stable identifier (a ChEBI ID, an InChIKey) and compute a
      canonical form, so that “the same thing” can be checked by a machine rather than by eye.
    </P>
    <H2>What a formula is good for</H2>
    <P>
      Everything downstream begins with it. The formula gives the exact mass to search for, the number of rings and double bonds, and the elements
      present. Given a measured mass and enough resolution, a formula can be assigned uniquely. The structure then has to be established by other
      evidence: spectra, synthesis, or a crystal. <Ref href={P07}>Reading a line drawing</Ref> covers what the drawing itself can and cannot say.
    </P>
    <InShort
      items={[
        <>Formula → mass and element counts. Not → which compound.</>,
        <>Constitutional isomers differ in connectivity; stereoisomers differ in three-dimensional arrangement.</>,
        <>Identity is an identifier and a canonical structure, not a formula and not a drawing style.</>,
      ]}
    />
  </>
);

/* 09 ─────────────────────────────────────────────────────────────────────── */
const ComputedOrMeasured = () => (
  <>
    <P>
      A data sheet staples two kinds of information together. Some fields were computed from the drawn structure by a program; others were measured
      by someone, somewhere, and copied from a paper. Telling the two apart explains why some numbers agree across every source to the last digit
      and others do not.
    </P>
    <H2>Derived from the structure</H2>
    <UL>
      <LI>
        <strong>Formula, average mass, monoisotopic mass:</strong> counted and summed from the structure and the atomic weights. Deterministic. Two
        sources disagree only if they use atomic weights from different years, and then only in the third decimal of the average mass.
      </LI>
      <LI>
        <strong>Identifiers</strong> such as SMILES and InChI: generated from the connectivity and the wedges, so the same structure always yields the
        same string.
      </LI>
      <LI>
        <strong>Predicted properties:</strong> a calculated partition coefficient, a count of hydrogen-bond donors, a polar surface area. Model
        outputs, consistent within one source and not necessarily between sources.
      </LI>
    </UL>
    <H2>Measured in a laboratory</H2>
    <UL>
      <LI>
        <strong>Melting and boiling points, solubility, density:</strong> taken from the literature, with the citation on the record. Values vary
        with purity and method, so ranges are common.
      </LI>
      <LI>
        <strong>Measured mass:</strong> a mass spectrum confirms the monoisotopic mass to within a few parts per million. Agreement between the
        computed and the measured value is how a formula is assigned to an unknown.
      </LI>
      <LI>
        <strong>Spectra</strong> (NMR, IR): experimental evidence for the connectivity the drawing claims.
      </LI>
    </UL>
    <H2>How to read a record</H2>
    <P>
      Treat computed fields as restatements of the structure: if the drawing is right, they are right. Treat measured fields as claims with a
      provenance, and follow the citation when the number matters. Well-run resources mark the difference: ChEBI lists its atomic weights and the
      display precision it keeps; PubChem labels each property as computed or experimental and names the source of each.{" "}
      <Ref href={P05}>Two masses, one molecule</Ref> covers the two computed masses a record carries, and <Ref href={P01}>What a mole actually counts</Ref>{" "}
      the units they are quoted in.
    </P>
    <InShort
      items={[
        <>Formula, masses and identifiers are derived from the structure; they are only as right as the drawing.</>,
        <>Physical constants are measured and cited; expect ranges and check the source.</>,
        <>A measured mass matching the computed one is evidence for the formula, not for the structure.</>,
      ]}
    />
  </>
);

export const ARTICLE_BODIES: Record<string, () => ReactNode> = {
  "what-a-mole-counts": WhatAMoleCounts,
  "making-a-solution-to-a-target-concentration": MakingASolution,
  "changing-units-without-losing-your-place": ChangingUnits,
  "significant-figures-and-what-a-balance-can-promise": SignificantFigures,
  "two-masses-one-molecule": TwoMasses,
  "the-arithmetic-of-chains": ArithmeticOfChains,
  "reading-a-line-drawing": ReadingALineDrawing,
  "same-formula-different-substance": SameFormulaDifferentSubstance,
  "computed-or-measured": ComputedOrMeasured,
};
