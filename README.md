# purasynth.shop

Two things live in this repo, deployed through Vercel's GitHub integration
(every push to `main` is a production deploy):

1. **Bench Primer** at `/` — a nine-part primer series on measurement in the
   chemistry lab: moles and molar mass, solution preparation, units,
   significant figures, the two masses of a molecule, residues, line drawings,
   isomers, and reading a data sheet. Plus tables and two calculators. Routes
   under `app/(science)/`.
2. **The offer page** at `/offer` — one screen that shows the store's current
   deal and its code, and sends the visitor to purasynth.com with the code ready
   at checkout. Not linked from the primer series.

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Before pushing, run `npm run build` and check the
exit code: `next dev` skips type-checking, the build does not.

`npm test` runs the unit tests (Vitest). `npm run lint` runs ESLint.

## The primer series

| Where | What |
| --- | --- |
| `lib/blog.ts` | Site name, tagline, route paths, and the index of primers (slug, number, title, topic, dek, date). |
| `lib/articles.tsx` | The primer bodies, keyed by slug, written with the elements in `components/science/prose.tsx`. |
| `lib/mass.ts` | Atomic masses, formula parsing, the twenty residues, sequence mass. `tests/mass.test.ts` pins the standard residue masses. |
| `lib/units.ts` | Solution preparation, dilution, mass ↔ moles, SI prefixes, significant-figure formatting. `tests/units.test.ts` pins the worked examples. |
| `components/science/structures.tsx` | Skeletal formulas (glycine, leucine, isoleucine) as inline SVG. |
| `components/science/solution-calculator.tsx`, `peptide-mass-calculator.tsx` | The `/calculators` page (client-side only). |

Every number on the site is computed at render time from those two
libraries, so the primers, the tables and the calculators cannot disagree.
Adding a primer: an entry in `ARTICLES` (next number), a body in
`ARTICLE_BODIES` under the same slug. The test suite fails if the two drift
apart. The sitemap lists the primer series only. The first-day paths
(`/articles`, `/reference`, `/tools`) redirect permanently.

## The offer page

Everything customer-facing about the deal is in `lib/offer.ts`: the code, the
percentage, the end date, the headline copy, the button label and where on the
store the button lands. `liveOffer()` at the bottom of that file is the switch
that decides which offer the page hands out, evaluated on every request.

| Offer | Code | Ends |
| --- | --- | --- |
| `SPECIAL20_OFFER` — November Sale, 20% off + Buy 2, Get 1 Free | SPECIAL20 | Nov 8 2026, 11:59 PM Pacific, with the store's sale |

A code must be an active code on the store; the store validates it server-side
at checkout, this site never does. Past an offer's `endsAt` the page renders an
"offer ended" state and links to the store without a code.

The claim link carries `?promo=CODE` plus `utm_source` / `utm_medium` naming
this page, unless the visitor arrived with campaign tags or an ad click id, in
which case those are forwarded instead (see `lib/attribution.ts`). The Meta
pixel loads on `/offer` only (`components/meta-pixel.tsx`).

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (https, no trailing slash). Falls back to `https://purasynth.shop`. |
