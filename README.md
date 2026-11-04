# purasynth.shop

Offer landing page for **purasynth.shop**: one screen that shows the store's
current deal and its code, and sends the visitor to purasynth.com with the code
ready at checkout. Deployed through Vercel's GitHub integration: every push to
`main` is a production deploy.

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Before pushing, run `npm run build` and check the
exit code: `next dev` skips type-checking, the build does not.

`npm test` runs the unit tests (Vitest). `npm run lint` runs ESLint.

## Change the offer

Everything customer-facing about the deal is in `lib/offer.ts`: the code, the
percentage, the end date, the headline copy, the button label and where on the
store the button lands. `liveOffer()` at the bottom of that file is the switch
that decides which offer the page hands out, evaluated on every request.

| Offer | Code | Ends |
| --- | --- | --- |
| `SPECIAL20_OFFER` — November Sale, 20% off + Buy 2, Get 1 Free | SPECIAL20 | Nov 8 2026, 11:59 PM Pacific, with the store's sale |

A code must be an active code on the store; the store validates it server-side
at checkout, this site never does. Past an offer's `endsAt` the page renders an
"offer ended" state and links to the store without a code, so nobody is
promised a discount the checkout will refuse.

## Attribution

The claim link carries `?promo=CODE` plus `utm_source` / `utm_medium` naming
this page, unless the visitor arrived with campaign tags or an ad click id, in
which case those are forwarded instead (see `lib/attribution.ts`). A visit from
inside the Instagram, Facebook or TikTok in-app browser with nothing on the
link is tagged with that platform from the referrer or the user agent.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (https, no trailing slash). Falls back to `https://purasynth.shop`. |
