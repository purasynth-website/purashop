import type { ReactNode } from "react";
import { Formula, GlycineStructure, IsoleucineStructure, LeucineStructure } from "@/components/science/structures";
import { CC_BY, CHEBI, Calc, Code, H2, IUPAC_WEIGHTS, KeyPoints, LI, Note, P, Ref, Source, Table, UL } from "@/components/science/prose";
import { ATOMIC_MASS, PROTON_MASS, RESIDUES, fmt, formulaMass, peptideMass, residueMass } from "@/lib/mass";

/**
 * The explainer bodies, keyed by slug (the index is lib/blog.ts). Every number
 * is computed by lib/mass.ts at render time so the text can never drift from
 * the reference tables or the tool.
 */

const gly = formulaMass("C2H5NO2");
const leu = formulaMass("C6H13NO2");
const water = formulaMass("H2O");
const glucose = formulaMass("C6H12O6");
const gag = peptideMass("GAG");

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

const MolecularWeight = () => (
  <>
    <P>
      Three terms turn up on the same database record, often with the same number beside each. They are not synonyms, but in everyday use they are
      treated as one, and for most purposes that does no harm. The differences are in what is being measured and which unit goes with it.
    </P>
    <H2>Molecular mass</H2>
    <P>
      The mass of one molecule, in <strong>daltons (Da)</strong>, also written as unified atomic mass units (u). One dalton is one twelfth of the
      mass of a carbon-12 atom. Water is about {fmt(water.average, 3)} Da: two hydrogens and one oxygen, each taken at its average mass over the
      isotopes found in nature.
    </P>
    <H2>Molar mass</H2>
    <P>
      The mass of one <strong>mole</strong> of the substance, 6.02214076 × 10<sup>23</sup> molecules, in <strong>grams per mole (g/mol)</strong>. The
      dalton was defined so that these two numbers coincide: a molecule of {fmt(water.average, 3)} Da belongs to a substance with a molar mass of{" "}
      {fmt(water.average, 3)} g/mol. Same digits, different unit, different question.
    </P>
    <H2>Molecular weight</H2>
    <P>
      The older term. Strictly it is a <em>relative</em> molecular mass, the ratio of a molecule&apos;s mass to one dalton, and so has no unit. In
      practice &ldquo;molecular weight&rdquo; is what most people say when they mean molar mass, and a value written as &ldquo;MW 180.16&rdquo; is
      read as 180.16 g/mol without anyone being confused.
    </P>
    <H2>A worked example</H2>
    <P>
      Glucose, <Code>C6H12O6</Code>. Multiply each element&apos;s count by its standard atomic weight and add:
    </P>
    <Calc
      lines={[
        `C   6 × ${ATOMIC_MASS.C.average}  =  ${fmt(6 * ATOMIC_MASS.C.average, 3)}`,
        `H  12 × ${ATOMIC_MASS.H.average}   =  ${fmt(12 * ATOMIC_MASS.H.average, 3)}`,
        `O   6 × ${ATOMIC_MASS.O.average}  =  ${fmt(6 * ATOMIC_MASS.O.average, 3)}`,
        `                    ———————`,
        `                    ${fmt(glucose.average, 3)} Da  (${fmt(glucose.average, 2)} g/mol)`,
      ]}
      caption="Standard atomic weights from IUPAC. A database using more decimal places will land within a few thousandths of this."
    />
    <P>
      That is the <em>average</em> molecular mass. A high-resolution mass spectrometer reports something slightly different, {fmt(glucose.mono, 5)} Da,
      because it sees one isotopic species at a time. The next explainer, <Ref href="/articles/average-exact-and-monoisotopic-mass">average, exact and
      monoisotopic mass</Ref>, is about that gap.
    </P>
    <Note title="Where the atomic weights come from">
      The standard atomic weights are published by IUPAC&apos;s Commission on Isotopic Abundances and Atomic Weights (<Source href={IUPAC_WEIGHTS}>current table</Source>).
      For carbon, hydrogen, nitrogen and oxygen they are intervals, because the isotope mix varies slightly with the source of the sample; the single
      &ldquo;abridged&rdquo; value is what calculations use.
    </Note>
    <KeyPoints
      items={[
        <>Molecular mass is per molecule, in Da. Molar mass is per mole, in g/mol. The numbers are the same by design.</>,
        <>&ldquo;Molecular weight&rdquo; is the informal name for either, strictly a unitless ratio.</>,
        <>All three are computed from the formula and the standard atomic weights; nothing is measured.</>,
      ]}
    />
  </>
);

const AminoAcidsResidues = () => (
  <>
    <P>
      Look up glycine and you find {fmt(gly.mono, 5)} Da. Look up the mass of a glycine inside a peptide and you find {fmt(residueMass("G")!.mono, 5)} Da.
      The second number is the one a sequence is built from, and the difference between them is exactly one water molecule.
    </P>
    <H2>What a residue is</H2>
    <P>
      When two amino acids join, the carboxyl group of one and the amino group of the other form a peptide bond and release H<sub>2</sub>O. Each
      amino acid in the chain has therefore lost a water&apos;s worth of atoms, and what is left of it is called a <strong>residue</strong>. A residue
      is an amino acid minus H<sub>2</sub>O: for glycine, <Code>C2H5NO2</Code> becomes <Code>C2H3NO</Code>.
    </P>
    <Calc
      lines={[
        `glycine            C2H5NO2   ${fmt(gly.mono, 5)} Da`,
        `− water            H2O       ${fmt(water.mono, 5)} Da`,
        `= glycine residue  C2H3NO    ${fmt(residueMass("G")!.mono, 5)} Da`,
      ]}
      caption="Monoisotopic masses."
    />
    <H2>The mass of a sequence</H2>
    <P>
      A linear peptide with ordinary free ends is the sum of its residues <em>plus one water</em>: the chain still carries a hydrogen at the N-terminus and
      a hydroxyl at the C-terminus that no bond consumed. For Gly-Ala-Gly:
    </P>
    <Calc
      lines={[
        `Gly  ${fmt(residueMass("G")!.mono, 5)}`,
        `Ala  ${fmt(residueMass("A")!.mono, 5)}`,
        `Gly  ${fmt(residueMass("G")!.mono, 5)}`,
        `H2O  ${fmt(water.mono, 5)}`,
        `———————————————`,
        `     ${fmt(gag.mono, 5)} Da   (${gag.formula})`,
      ]}
      caption={`Average mass by the same route: ${fmt(gag.average, 3)} Da.`}
    />
    <P>
      A mass spectrometer does not report the neutral molecule. It reports an ion, most often the molecule plus a proton, [M+H]<sup>+</sup>, which
      adds {fmt(PROTON_MASS, 5)} Da; for Gly-Ala-Gly that is {fmt(gag.mono + PROTON_MASS, 4)}. Modifications change the sum too: a disulfide bridge
      removes two hydrogens, an amidated C-terminus swaps OH for NH<sub>2</sub>. The <Ref href="/tools">peptide mass tool</Ref> does the unmodified
      arithmetic for any sequence.
    </P>
    <H2>The twenty residues</H2>
    <ResidueTable />
    <Note title="Leucine and isoleucine">
      Two rows in that table are identical to five decimals. Leucine and isoleucine have the same formula and differ only in how the atoms are
      connected, so no mass measurement can tell them apart. <Ref href="/articles/a-molecular-formula-is-not-a-unique-identity">A molecular
      formula is not a unique identity</Ref> is about exactly this.
    </Note>
    <KeyPoints
      items={[
        <>Residue = amino acid − H<sub>2</sub>O. Sequences are sums of residues.</>,
        <>Peptide mass = residues + one water, for free termini and no modifications.</>,
        <>Measured values are ions: add a proton for [M+H]<sup>+</sup>.</>,
      ]}
    />
  </>
);

const ReadingStructures = () => (
  <>
    <P>
      A skeletal formula is a compression scheme. It leaves out the atoms that are everywhere, carbon and the hydrogens attached to carbon, so
      that what is unusual about a molecule stands out. Five conventions are enough to read one.
    </P>
    <H2>1. Every corner and every line end is a carbon</H2>
    <P>
      Bonds are drawn as lines. Where two lines meet, or where a line simply stops, there is a carbon atom that is not written. A zigzag of four
      segments is a chain of five carbons.
    </P>
    <H2>2. Hydrogens on carbon are implied</H2>
    <P>
      Carbon makes four bonds. Count the lines reaching a corner; whatever is missing from four is hydrogen. A corner with two lines is a CH
      <sub>2</sub>, a line end is a CH<sub>3</sub>.
    </P>
    <H2>3. Anything that is not carbon is written</H2>
    <P>
      Nitrogen, oxygen and sulfur appear as their symbols, usually with their own hydrogens attached: OH, NH<sub>2</sub>, SH. A double bond is two
      parallel lines.
    </P>
    <figure className="mt-6 rounded-2xl border border-moss-100 bg-moss-50/60 p-5">
      <div className="mx-auto max-w-xs text-moss-900">
        <GlycineStructure className="w-full" title="Glycine, skeletal formula: H2N–CH2–COOH" />
      </div>
      <figcaption className="mt-2 text-center text-sm text-stone-600">
        Glycine. One corner (a CH<sub>2</sub>), one line end that is a carbon carrying a double-bonded O and an OH, and an NH<sub>2</sub>. Count it up:{" "}
        <Formula>C2H5NO2</Formula>. Source structure: <Source href={CHEBI(15428)}>CHEBI:15428</Source>.
      </figcaption>
    </figure>
    <H2>4. Wedges show depth</H2>
    <P>
      A flat drawing cannot show that a carbon with four different neighbours is a three-dimensional centre. A <strong>filled wedge</strong> means the
      bond comes toward you; a <strong>hashed wedge</strong> means it goes away. Where it matters, the configuration is also named in the text: (S) or
      (R) for each such centre, L or D for amino acids and sugars.
    </P>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <figure className="rounded-2xl border border-moss-100 bg-moss-50/60 p-5 text-moss-900">
        <LeucineStructure className="w-full" title="L-leucine, skeletal formula with the amino group on a filled wedge" />
        <figcaption className="mt-2 text-sm text-stone-600">
          <strong>L-Leucine</strong>, (2S). One stereocentre, the carbon carrying NH<sub>2</sub>. <Source href={CHEBI(15603)}>CHEBI:15603</Source>
        </figcaption>
      </figure>
      <figure className="rounded-2xl border border-moss-100 bg-moss-50/60 p-5 text-moss-900">
        <IsoleucineStructure className="w-full" title="L-isoleucine, skeletal formula with the amino group on a filled wedge and the branch methyl on a hashed wedge" />
        <figcaption className="mt-2 text-sm text-stone-600">
          <strong>L-Isoleucine</strong>, (2S,3S). Two stereocentres: the NH<sub>2</sub> carbon and the branching carbon next to it.{" "}
          <Source href={CHEBI(17191)}>CHEBI:17191</Source>
        </figcaption>
      </figure>
    </div>
    <H2>5. Charges are written, and the drawing is one form</H2>
    <P>
      An amino acid in water exists mostly as a <em>zwitterion</em>: NH<sub>3</sub><sup>+</sup> at one end, COO<sup>−</sup> at the other. Drawings
      usually show the neutral form because it is simpler and the mass is identical. If a charge matters, it is written as a superscript beside the
      atom that carries it.
    </P>
    <Note title="The same thing as text">
      A SMILES string encodes the same drawing as characters. Glycine is <Code>NCC(=O)O</Code>; L-leucine is <Code>CC(C)C[C@H](N)C(=O)O</Code>;
      L-isoleucine is <Code>CC[C@H](C)[C@H](N)C(=O)O</Code>. The <Code>@</Code> marks carry the wedge information.
    </Note>
    <KeyPoints
      items={[
        <>Corners and line ends are carbons; missing bonds to four are hydrogens.</>,
        <>Everything else is written: N, O, S and their hydrogens, double bonds, charges.</>,
        <>Wedges are the only depth information. Without them, a drawing cannot distinguish mirror-image forms.</>,
      ]}
    />
  </>
);

const CalculatedVsMeasured = () => (
  <>
    <P>
      A substance record in a chemical database is two kinds of information stapled together. Some fields were computed from the drawn structure
      by a program; others were measured by someone, somewhere, and curated from a paper. Telling the two apart explains why some numbers agree
      across every database to the last digit and others do not.
    </P>
    <H2>Computed from the structure</H2>
    <UL>
      <LI>
        <strong>Molecular formula</strong>, <strong>average mass</strong>, <strong>monoisotopic mass</strong>: counted and summed from the structure and
        the atomic weights. Deterministic. Two databases disagree only if they use atomic weights from different years, and then only in the third
        decimal place of the average mass.
      </LI>
      <LI>
        <strong>Identifiers</strong> such as SMILES and InChI: generated from the connectivity and the wedges, so the same structure always yields the
        same string.
      </LI>
      <LI>
        <strong>Predicted properties</strong>: a calculated partition coefficient (XLogP), a count of hydrogen-bond donors, a polar surface area. These
        are model outputs, consistent within one database and not necessarily between databases.
      </LI>
    </UL>
    <H2>Measured in a laboratory</H2>
    <UL>
      <LI>
        <strong>Melting and boiling points</strong>, <strong>solubility</strong>, <strong>density</strong>: taken from the literature, with the source cited
        on the record. Values vary with purity and method, so ranges are common.
      </LI>
      <LI>
        <strong>Measured mass</strong>: a mass spectrum confirms the monoisotopic mass to within a few parts per million. Agreement between the
        computed and the measured value is how a formula is assigned to an unknown.
      </LI>
      <LI>
        <strong>Spectra</strong> (NMR, IR): experimental evidence for the connectivity the drawing claims.
      </LI>
    </UL>
    <H2>How to read a record</H2>
    <P>
      Treat computed fields as restatements of the structure: if the drawing is right, they are right. Treat measured fields as claims with a
      provenance, and follow the citation when the number matters. Well-run resources mark the difference. ChEBI lists its atomic weights and
      the display precision it retains; PubChem labels each property as computed or experimental and names the source of each.
    </P>
    <KeyPoints
      items={[
        <>Formula, masses and identifiers are derived from the structure; they are only as right as the drawing.</>,
        <>Physical constants are measured and cited; expect ranges and check the source.</>,
        <>A measured mass that matches the computed one is evidence the formula is correct, not the structure.</>,
      ]}
    />
  </>
);

const FormulaNotIdentity = () => (
  <>
    <P>
      Atom counts are a powerful starting point. A formula fixes the mass, narrows the candidates and rules out most of chemistry. It does not
      say which compound you have. Connectivity, stereochemistry and representation are what finish the job.
    </P>
    <figure className="mt-6 rounded-2xl border border-moss-100 bg-gradient-to-r from-moss-50 to-moss-100/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss-700">One formula, two structures</p>
      <p className="mt-1 font-display text-4xl font-semibold tracking-tight text-moss-900">
        <Formula>C6H13NO2</Formula>
      </p>
      <div className="mt-4 grid gap-4 text-moss-900 sm:grid-cols-2">
        <div>
          <LeucineStructure className="w-full max-w-[240px]" title="L-leucine" />
          <p className="mt-1 text-sm font-semibold">L-Leucine</p>
          <p className="text-xs text-stone-600">2S</p>
        </div>
        <div>
          <IsoleucineStructure className="w-full max-w-[240px]" title="L-isoleucine" />
          <p className="mt-1 text-sm font-semibold">L-Isoleucine</p>
          <p className="text-xs text-stone-600">2S,3S</p>
        </div>
      </div>
      <figcaption className="mt-3 border-t border-moss-200/70 pt-3 text-sm text-stone-600">
        The branching makes the difference. Structures after <Source href={CHEBI(15603)}>CHEBI:15603</Source> and{" "}
        <Source href={CHEBI(17191)}>CHEBI:17191</Source> (<Source href={CC_BY}>CC BY 4.0</Source>), redrawn.
      </figcaption>
    </figure>
    <H2>Constitutional isomers</H2>
    <P>
      Leucine and isoleucine share <Formula>C6H13NO2</Formula> and a monoisotopic mass of {fmt(leu.mono, 5)} Da. In leucine the side chain branches at its
      second carbon; in isoleucine it branches at the first. Same atoms, different wiring. They are different compounds with different
      biochemistry, and no balance or mass spectrometer can tell them apart. Only the connectivity can.
    </P>
    <H2>Stereoisomers</H2>
    <P>
      Fix the connectivity and there is still more than one molecule. Leucine has one stereocentre and therefore two mirror-image forms, L and D.
      Isoleucine has two stereocentres and four stereoisomers, of which only (2S,3S) is the one found in proteins. A drawing without wedges, or a
      SMILES without <Code>@</Code>, describes all of them at once.
    </P>
    <H2>Representation</H2>
    <P>
      Even one specific molecule can be written several ways. The neutral form and the zwitterion are the same substance. Two SMILES strings can
      encode the same structure in different orders. This is why databases assign a stable identifier (a ChEBI ID, an InChIKey) and compute a
      canonical form: so that &ldquo;the same thing&rdquo; can be checked by a machine rather than by eye.
    </P>
    <H2>What a formula is good for</H2>
    <P>
      Everything downstream begins with it. The formula gives the exact mass to search for, the number of rings and double bonds (the degree of
      unsaturation), and the elements present. Given a measured mass and enough resolution, a formula can be assigned uniquely. The structure then
      has to be established by other evidence: spectra, synthesis, or a crystal.
    </P>
    <KeyPoints
      items={[
        <>Formula → mass and element counts. Not → which compound.</>,
        <>Constitutional isomers differ in connectivity; stereoisomers differ in three-dimensional arrangement.</>,
        <>Identity is an identifier and a canonical structure, not a formula and not a drawing style.</>,
      ]}
    />
  </>
);

const AverageExactMono = () => (
  <>
    <P>
      Open the record for glycine and two masses sit a line apart: {fmt(gly.average, 3)} Da and {fmt(gly.mono, 5)} Da. Both are correct. They answer
      different questions, and the difference between them comes from isotopes.
    </P>
    <H2>Isotopes</H2>
    <P>
      Natural carbon is about 98.9% carbon-12 and 1.1% carbon-13. Hydrogen, nitrogen and oxygen each have a heavier minor isotope too. A sample of any
      compound is therefore a mixture of molecules with slightly different masses, depending on which isotopes each one happens to contain.
    </P>
    <H2>Average mass</H2>
    <P>
      The mass of the mixture, per molecule, using each element&apos;s <strong>standard atomic weight</strong>, the abundance-weighted mean over its
      isotopes. This is the number a balance agrees with, the one molar mass is built on, and the one to use for weighing out a sample.
    </P>
    <H2>Monoisotopic mass</H2>
    <P>
      The mass of one specific molecule made entirely of each element&apos;s <strong>most abundant isotope</strong>: every carbon a carbon-12, every
      hydrogen a hydrogen-1, and so on. It is what a high-resolution mass spectrometer reports as the first and usually tallest peak of a small
      molecule. &ldquo;Exact mass&rdquo; almost always means this.
    </P>
    <H2>Nominal mass</H2>
    <P>
      The integer version, using whole-number isotope masses (C = 12, H = 1, N = 14, O = 16). Glycine is 75. Useful for a quick check, too coarse for
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
        `                                 ————————                     ———————`,
        `                                 ${fmt(gly.mono, 5)} Da                  ${fmt(gly.average, 3)} Da`,
      ]}
      caption="The monoisotopic column uses exact isotope masses; the average column uses the IUPAC abridged standard atomic weights."
    />
    <H2>When the gap matters</H2>
    <UL>
      <LI>For a small molecule the two differ by a few hundredths of a dalton. Either rounds to the same integer.</LI>
      <LI>
        For a peptide of a few thousand daltons the gap is about one dalton, and the monoisotopic peak is no longer the tallest: a molecule with
        one or two carbon-13 atoms becomes more likely than one with none.
      </LI>
      <LI>For a protein, the monoisotopic peak is too small to see; only the average mass is practical.</LI>
    </UL>
    <Note title="Which one to quote">
      Weighing, concentrations and molar mass: average. Mass spectrometry, formula assignment and anything labelled &ldquo;exact&rdquo;: monoisotopic.
      A record that gives both, with the atomic weights it used, is doing it right.
    </Note>
    <KeyPoints
      items={[
        <>Average mass: the natural isotope mixture, what a balance measures. Monoisotopic: all-lightest-isotope, what a mass spectrometer measures.</>,
        <>&ldquo;Exact mass&rdquo; means monoisotopic. Nominal mass is the integer.</>,
        <>The gap grows with size: negligible for small molecules, about a dalton per few thousand daltons.</>,
      ]}
    />
  </>
);

export const ARTICLE_BODIES: Record<string, () => ReactNode> = {
  "molecular-weight-molecular-mass-and-molar-mass": MolecularWeight,
  "amino-acids-peptide-residues-and-sequence-mass": AminoAcidsResidues,
  "how-to-read-a-two-dimensional-chemical-structure": ReadingStructures,
  "calculated-properties-and-experimental-evidence": CalculatedVsMeasured,
  "a-molecular-formula-is-not-a-unique-identity": FormulaNotIdentity,
  "average-exact-and-monoisotopic-mass": AverageExactMono,
};
