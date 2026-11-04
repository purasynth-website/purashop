/**
 * The primer series: its name, its tagline and the index of primers. Bodies
 * live in lib/articles.tsx; this file is what the home page, the index, the
 * sitemap and the tests read.
 */
export const SITE_NAME = "Bench Primer";
export const SITE_KICKER = "Lab measurement, explained";
export const SITE_TAGLINE = "Short primers on measurement in the chemistry lab.";
export const SITE_DESCRIPTION =
  "Nine short primers on how the quantities on a data sheet are defined, computed and measured: moles and molar mass, concentrations and units, the two masses of a molecule, line drawings. Every calculation shown, every constant sourced.";

export const PATHS = {
  primers: "/primers",
  tables: "/tables",
  calculators: "/calculators",
  about: "/about",
} as const;

export type Topic = "Quantities & units" | "Mass & formula" | "Structure" | "Data sheets";

export type Article = {
  slug: string;
  /** Position in the reading order, 1-based. */
  number: number;
  title: string;
  topic: Topic;
  /** One or two sentences for the index and the <meta> description. */
  dek: string;
  readMinutes: number;
  /** ISO date of the last substantive edit, shown on the page. */
  updated: string;
};

export const ARTICLES: ReadonlyArray<Article> = [
  {
    slug: "what-a-mole-counts",
    number: 1,
    title: "What a mole actually counts",
    topic: "Quantities & units",
    dek: "A mole is a count, not a weight. Fix that in place and molar mass, molecular mass and molecular weight stop being three confusing names for one number.",
    readMinutes: 4,
    updated: "2026-09-29",
  },
  {
    slug: "making-a-solution-to-a-target-concentration",
    number: 2,
    title: "Making a solution to a target concentration",
    topic: "Quantities & units",
    dek: "Concentration times volume times molar mass. Where the units go, what a hydrate does to the answer, and why purity is a division rather than a subtraction.",
    readMinutes: 5,
    updated: "2026-10-02",
  },
  {
    slug: "changing-units-without-losing-your-place",
    number: 3,
    title: "Changing units without losing your place",
    topic: "Quantities & units",
    dek: "Carry the units through the arithmetic and a factor of a thousand can never go the wrong way. Prefixes, mass to moles, and the concentration conversions that need a molar mass.",
    readMinutes: 4,
    updated: "2026-10-07",
  },
  {
    slug: "significant-figures-and-what-a-balance-can-promise",
    number: 4,
    title: "Significant figures and what a balance can promise",
    topic: "Quantities & units",
    dek: "A calculation gives you as many digits as you like; an instrument gives you a fixed number of them. How to count them, carry them, and stop at the right one.",
    readMinutes: 4,
    updated: "2026-10-10",
  },
  {
    slug: "two-masses-one-molecule",
    number: 5,
    title: "Two masses, one molecule",
    topic: "Mass & formula",
    dek: "Glycine is 75.067 Da on one line of a data sheet and 75.03203 Da on the next. Neither is a typo. Isotopes are the reason, and each number has its own job.",
    readMinutes: 4,
    updated: "2026-10-14",
  },
  {
    slug: "the-arithmetic-of-chains",
    number: 6,
    title: "The arithmetic of chains",
    topic: "Mass & formula",
    dek: "A residue is an amino acid minus one water. Why a sequence is a sum of residues plus one water, and the full table of the twenty residue masses.",
    readMinutes: 4,
    updated: "2026-10-17",
  },
  {
    slug: "reading-a-line-drawing",
    number: 7,
    title: "Reading a line drawing",
    topic: "Structure",
    dek: "Skeletal formulas leave out the carbons and the hydrogens on purpose. Five rules are enough to read any of them, with glycine, leucine and isoleucine drawn out.",
    readMinutes: 4,
    updated: "2026-10-21",
  },
  {
    slug: "same-formula-different-substance",
    number: 8,
    title: "Same formula, different substance",
    topic: "Structure",
    dek: "Two compounds can share a formula to the last atom and still be different things. Connectivity, geometry and spelling are what tell them apart.",
    readMinutes: 4,
    updated: "2026-10-24",
  },
  {
    slug: "computed-or-measured",
    number: 9,
    title: "Computed or measured?",
    topic: "Data sheets",
    dek: "A data sheet staples two kinds of number together: ones a program derived from the structure and ones somebody measured. Telling them apart tells you which to trust and how far.",
    readMinutes: 3,
    updated: "2026-10-28",
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articlePath(slug: string): string {
  return `${PATHS.primers}/${slug}`;
}

/** "20 Oct 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    Date.UTC(y, m - 1, d),
  );
}

/** "04" — the primer number as printed. */
export function padNumber(n: number): string {
  return String(n).padStart(2, "0");
}

export const TOPICS: ReadonlyArray<Topic> = ["Quantities & units", "Mass & formula", "Structure", "Data sheets"];

export const TOPIC_DESCRIPTIONS: Record<Topic, string> = {
  "Quantities & units": "Moles, concentrations, prefixes and the digits an instrument can honestly give you.",
  "Mass & formula": "Why a molecule has two masses, and how a chain adds up.",
  Structure: "Reading a drawing, and what a drawing cannot tell you.",
  "Data sheets": "Which numbers on a record were computed and which were measured.",
};
