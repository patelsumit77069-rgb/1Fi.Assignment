# 1Fi Marketplace — Shop page feature

Submission for the 1Fi SDE Intern assignment: adds a fully-implemented
**1Fi Marketplace** section to the existing Shop page, alongside
**Top Brands** and **Nearby Stores** (left blank, per the spec).

A live interactive preview of the same UI is included at
`prototype/MarketplacePrototype.jsx` (single-file version) if you want to
see it running without installing anything.

## What's implemented

- **Shop page shell** — hero banner and the pill tab switcher, matching the
  existing app's purple hero, tab styling, search bar, and bottom nav.
- **Top Brands / Nearby Stores** — left as blank placeholders (no
  implementation required by the brief).
- **1Fi Marketplace**, fully built:
  - Product listing with search, images (placeholder icons), name, brand,
    rating, price, and starting EMI.
  - Product detail screen with description, variant selection (storage /
    colour / size, each with its own price delta), and live price update.
  - EMI plan selection — tenure options generated per product, monthly
    amount computed from the final (variant-adjusted) price, no-cost EMI
    messaging consistent with the app's existing "No-cost EMIs" framing.
  - CTA to confirm the selected plan, and a confirmation screen with an
    order summary.
  - Loading skeletons, error states with retry, and an empty state for
    search, on every screen that fetches data.

## Architecture

```
src/
  api/marketplaceApi.js     <- the only module that "talks to the network"
  data/products.js          <- mock catalog (stands in for a backend)
  context/                  <- nav context for the Marketplace tab's stack
  components/                <- reusable, presentational pieces
  screens/                   <- one file per screen, composed from components
  theme.js                   <- design tokens pulled from the existing app
  App.jsx / main.jsx         <- entry points
```

Data flows one way: **screens call `marketplaceApi`**, which returns
Promises (with simulated latency and an occasional simulated failure) and
resolves against `data/products.js`. No component reads the mock data
directly — swapping in real endpoints later means only editing
`marketplaceApi.js`; every screen and component stays the same, since they
only depend on the shape of the resolved/rejected Promise.

State is kept local to where it's used (React `useState`/`useEffect` in
each screen) plus one `Context` for navigation within the Marketplace tab
only — there's no global store, since nothing here needs to be shared
outside this one feature.

## Design decisions

- Colours, card radius/shadow, the pill tab switcher, and the bottom nav
  are all taken directly from the existing Shop page screenshot rather than
  reinvented, per the "UI/UX consistency" evaluation criterion.
- EMI amounts assume 0% interest (matching the app's own "No-cost EMIs"
  positioning) — `monthlyAmount = finalPrice / tenureMonths`. In a real
  system this calculation and eligibility would move server-side.
- Product images are placeholder emoji icons rather than real photos, since
  no product imagery was provided in the assignment's reference material.

## Running it

```bash
npm install
npm run dev
```

Requires Node 18+. Uses Vite + React + Tailwind (the interactive prototype
file follows the same Tailwind conventions, so either can be dropped into
an existing Vite/CRA/Next app with minimal changes).
## Live Demo

🚀 **Live Application:** [1Fi Marketplace](https://1-fi-assignment-nu.vercel.app/)

Check out the deployed project here:

👉 https://1-fi-assignment-nu.vercel.app/

