/**
 * The reading room: its name, its tagline and the index of explainers. Article
 * bodies live in lib/articles.tsx; this file is what the home page, the index,
 * the sitemap and the tests read.
 */
export const BLOG_NAME = "Molecule Notes";
export const BLOG_KICKER = "Science blog";
export const BLOG_TAGLINE = "Source-linked explanations. Molecular science, made clear.";
export const BLOG_DESCRIPTION =
  "Short explainers on molecular mass, amino acids and chemical structures, with the arithmetic shown and every number linked to its source record.";

export type Category = "Molecular mass" | "Biochemical definitions" | "Chemical structures";

export type Article = {
  slug: string;
  title: string;
  category: Category;
  /** One or two sentences for the index and the <meta> description. */
  summary: string;
  readMinutes: number;
  /** ISO date of the last substantive edit, shown on the page. */
  updated: string;
};

export const ARTICLES: ReadonlyArray<Article> = [
  {
    slug: "molecular-weight-molecular-mass-and-molar-mass",
    title: "Molecular weight, molecular mass and molar mass",
    category: "Molecular mass",
    summary:
      "Three names that usually point at the same number. What each one means, which unit goes with it, and a worked example from water to glucose.",
    readMinutes: 4,
    updated: "2026-10-06",
  },
  {
    slug: "amino-acids-peptide-residues-and-sequence-mass",
    title: "Amino acids, peptide residues and sequence mass",
    category: "Biochemical definitions",
    summary:
      "A residue is an amino acid minus one water. Why that matters, how a sequence adds up, and the full table of the twenty residue masses.",
    readMinutes: 4,
    updated: "2026-10-09",
  },
  {
    slug: "how-to-read-a-two-dimensional-chemical-structure",
    title: "How to read a two-dimensional chemical structure",
    category: "Chemical structures",
    summary:
      "Skeletal formulas hide the carbons and the hydrogens on purpose. The five conventions that let you read one, with glycine, leucine and isoleucine drawn out.",
    readMinutes: 4,
    updated: "2026-10-13",
  },
  {
    slug: "calculated-properties-and-experimental-evidence",
    title: "Calculated properties and experimental evidence",
    category: "Molecular mass",
    summary:
      "A database page mixes numbers computed from the structure with numbers someone measured. How to tell them apart, and why the computed ones agree everywhere.",
    readMinutes: 3,
    updated: "2026-10-16",
  },
  {
    slug: "a-molecular-formula-is-not-a-unique-identity",
    title: "A molecular formula is not a unique identity",
    category: "Chemical structures",
    summary:
      "Atom counts are a powerful starting point. Connectivity, stereochemistry and representation are what tell one C6H13NO2 from another.",
    readMinutes: 4,
    updated: "2026-10-20",
  },
  {
    slug: "average-exact-and-monoisotopic-mass",
    title: "Average, exact and monoisotopic mass",
    category: "Molecular mass",
    summary:
      "Glycine is 75.067 Da on one line of a database record and 75.03203 Da on the next. Both are right. Isotopes explain the gap.",
    readMinutes: 4,
    updated: "2026-10-24",
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** "20 Oct 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    Date.UTC(y, m - 1, d),
  );
}

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  "Molecular mass": "What the numbers on a record mean and how they are computed.",
  "Biochemical definitions": "Terms that look interchangeable and are not.",
  "Chemical structures": "Reading a drawing, and what a drawing cannot tell you.",
};
