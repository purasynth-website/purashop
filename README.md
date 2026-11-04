# purasynth.shop

Two things live in this repo, deployed through Vercel's GitHub integration
(every push to `main` is a production deploy):

1. **Molecule Notes** at `/` — a small molecular-science reading room: six
   explainers, reference tables and a peptide mass tool. Routes under
   `app/(science)/`.
2. **The offer page** at `/offer` — one screen that shows the store's current
   deal and its code, and sends the visitor to purasynth.com with the code ready
   at checkout. Not linked from the reading room.

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Before pushing, run `npm run build` and check the
exit code: `next dev` skips type-checking, the build does not.

`npm test` runs the unit tests (Vitest). `npm run lint` runs ESLint.

## The reading room

| Where | What |
| --- | --- |
| `lib/blog.ts` | Site name, tagline, and the index of explainers (slug, title, category, summary, date). |
| `lib/articles.tsx` | The explainer bodies, keyed by slug, written with the elements in `components/science/prose.tsx`. |
| `lib/mass.ts` | Atomic masses, formula parsing, the twenty residues, peptide mass. Every number on the site is computed from this file at render time, and `tests/mass.test.ts` pins the standard residue masses. |
| `components/science/structures.tsx` | Skeletal formulas (glycine, leucine, isoleucine) as inline SVG. |
| `components/science/peptide-mass-calculator.tsx` | The `/tools` calculator (client-side only). |

Adding an explainer: an entry in `ARTICLES`, a body in `ARTICLE_BODIES` under
the same slug. The test suite fails if the two drift apart. The sitemap lists
the reading room only.

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
