# Legal-Ops Copilot — Product Counsel demo

An interview prototype for a Product Counsel role: an internal legal-ops tool
presented as a clickable map of US states and Canadian provinces. Selecting a
jurisdiction shows a sample "issue-spot" brief across legal domains (alcohol,
pharmacy, payments, privacy, consumer protection, advertising), plus a triage
search and a "route to specialist" flow. A clearly-labeled **Expansion Horizon
(strategic, not current)** view maps regimes that would activate on
international expansion — hypothetical future scope, not present operations.

## ⚠️ Illustrative sample content only — not legal advice

Every piece of legal content in this app is **illustrative sample material**
created to demonstrate a product concept. It is **not legal advice**, is not
authoritative, and must not be relied on. The in-app disclaimer banners and the
**About / limits** panel (including "what I'd never let it do") are a deliberate
part of the demo and are intentionally preserved.

The sample jurisdiction data lives in
[`src/data/jurisdictions.ts`](src/data/jurisdictions.ts) with the same
non-authoritative caveat at the top of the file.

## Tech

- [Vite](https://vitejs.dev/) + React + TypeScript
- [`lucide-react`](https://lucide.dev/) for icons
- [`d3-geo`](https://github.com/d3/d3-geo) renders the geographic map (Albers
  projection) directly from bundled boundary data — no map library / runtime
  fetch. Boundaries are [Natural Earth](https://www.naturalearthdata.com/)
  1:50m admin-1 (public domain), slimmed to US states + Canadian provinces in
  [`src/data/geo/na-admin1.json`](src/data/geo/na-admin1.json).
- No backend. The triage search is a **client-side keyword match**, isolated
  behind a single function (`src/lib/triage.ts`) so a real AI-backed endpoint
  can be slotted in later without touching the UI. Live AI/agentic Q&A is a
  later phase and will need a backend host (GitHub Pages serves static files
  only).

## Run locally

```bash
npm install
npm run dev      # start the dev server (Vite prints the local URL)
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow
(`.github/workflows/deploy.yml`), which builds the site and publishes `dist/`
to **GitHub Pages**.

- Served at the custom subdomain **product-counsel.darrenbender.com** at the
  domain root, so Vite `base` is `'/'`.
- `public/CNAME` contains `product-counsel.darrenbender.com`; Vite copies it
  into `dist/` on build so Pages keeps the custom domain on every deploy.

### One-time manual setup

1. **DNS (GoDaddy):** a `CNAME` record, host `product-counsel` →
   `darrenbender.github.io`.
2. **Repo → Settings → Pages:** Source = **GitHub Actions**; set the custom
   domain to `product-counsel.darrenbender.com`; enable **Enforce HTTPS** once
   the certificate is issued.
