# Vera AgriTech — Website (Phase 1)

A modern, responsive rebuild of veraagritech.com, built as the first deployable layer of Vera AgriTech's wider Digital Greenhouse Platform (see the uploaded *Strategic Technology Audit & Preliminary Proposal* and *Product Design & Technical Architecture* documents). This phase delivers the public website, its content management system, and lead/application capture — nothing more. Phase 2+ (customer accounts, the Vera operations dashboard, field operations, financial automation, IoT) is explicitly out of scope here, per the architecture document's own phasing.

## What's in this phase

- A fully responsive, accessible, SEO-ready public website cloning every page and section of the previous site, plus the additional education pages the architecture document calls for (The Vera Model, Greenhouses, How It Works, Crops & Production, Financing, Market Access, Training & Support) that didn't exist as standalone pages before.
- Every image on the site is a clearly labelled **placeholder** until a real photo is uploaded through the admin Media Library — nothing fabricated or stock is used in its place.
- A lightweight, purpose-built **CMS and admin panel** (`/admin`) so the Vera AgriTech team can update page copy, packages, crops, FAQs, testimonials, case studies, blog posts, images, and site settings without touching code.
- **Lead capture** (Contact form, newsletter sign-up) and an **application/expression-of-interest** flow (Get Started), both landing in the admin panel's inbox — with honeypot spam trapping, server-side validation, and rate limiting.
- The **Calculator** page is deliberately in a "coming soon" state. Per the architecture document's Critical Product Rule ("No Invented Commercial Claims"), it does not publish any ROI/yield/revenue figures until Vera AgriTech supplies and approves the underlying assumptions. This was also explicit direction for this phase.

## Architecture

```
frontend/   React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router — a static SPA
backend/    Node.js + Express + SQLite (better-sqlite3) — CMS API, auth, lead/application capture, image uploads
docs/       Deployment guide for HostAfrica shared hosting
```

**Why a SPA + small Node API instead of a heavier framework?** HostAfrica shared hosting (the specified target) supports static file hosting plus cPanel's "Setup Node.js App" for lightweight Node processes. A Vite-built React SPA deploys as plain static files (fast, cheap, cacheable), while a small Express + SQLite backend is easy to run under cPanel's Node.js App selector without needing a separately managed database server. SQLite specifically (rather than MySQL/Postgres) was chosen because it needs no separate database server to provision or maintain on shared hosting — the entire CMS/leads database is one file that's trivial to back up. If traffic or team size later justifies it, swapping the `better-sqlite3` calls in `backend/src/routes/*` for a MySQL client is a contained, mechanical change — the schema (`backend/src/db/migrate.js`) is plain SQL.

**Content model.** Long-form page copy (headings, paragraphs, step lists) is stored as one JSON document per page and edited through a structured JSON editor in the admin panel (`Admin → Page Content`). Repeatable, business-critical collections — Packages, FAQs, Testimonials, Case Studies, Crops, Blog Posts, and every image — get dedicated, form-based admin screens instead. This was a deliberate scoping decision for phase 1: building a fully bespoke visual form for every paragraph across 19 pages was judged lower-value than shipping working lead capture, image management, and structured content for the highest-churn data (packages, pricing, FAQs). The JSON editor is clearly labelled and safe (it validates JSON before saving and shows the exact same data structure the page renders from). Revisiting this with a friendlier rich-text/field-based editor is a reasonable Phase 2 refinement.

**Resilience.** The frontend ships with the entire cloned content baked in as a static fallback (`frontend/src/data/content.json`). If the backend is briefly unreachable, visitors still see the complete site (with placeholder images) rather than a blank page.

## Local development

**Backend:**
```
cd backend
cp .env.example .env
npm install
npm run setup      # creates the SQLite DB, seeds it with the cloned content, creates a default admin
npm run dev         # http://localhost:4000
```
Default admin login (change immediately in any real deployment): see `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD` in `backend/.env`.

**Frontend:**
```
cd frontend
cp .env.example .env
npm install
npm run dev          # http://localhost:5173, proxies /api and /uploads to the backend
```

Visit `http://localhost:5173` for the public site and `http://localhost:5173/admin/login` for the admin panel.

## Production build

```
cd frontend
npm run build         # outputs frontend/dist — a static bundle ready to upload
```

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for the full HostAfrica cPanel deployment walkthrough (Node.js App setup for the backend, static upload for the frontend, `.htaccess` SPA routing, backups).

## Security & non-functional requirements addressed

- HTTPS enforced at the hosting layer (`.htaccess` redirect) and expected of the API host.
- JWT-based admin authentication (bcrypt-hashed passwords, 8-hour token expiry).
- Rate limiting on login (10/15 min) and public form submissions (20/15 min), plus a honeypot field on both public forms.
- Server-side input validation (`express-validator`) on every write endpoint.
- `helmet` security headers, strict CORS allow-list, request size limits.
- Upload validation: image MIME-type allow-list, 8MB size cap, randomised filenames.
- An `audit_log` table records admin content changes.
- Mobile-first responsive layout, semantic HTML, ARIA labelling on interactive components (nav dropdowns, accordion, skip-to-content link), visible focus states.
- `robots.txt`, `sitemap.xml`, per-page meta titles/descriptions, canonical URLs (via `react-helmet-async`).
- Code-splitting: the entire `/admin` panel is a separate JS chunk that public visitors never download.

## Verified before delivery

Every public page, the admin login/dashboard flow, and a full round-trip of the Contact form (submit → appears in the Leads inbox) were exercised with an automated headless-browser check against a production build running against the real backend — not just eyeballed in isolation.
