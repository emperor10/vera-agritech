# Deploying to HostAfrica Shared Hosting

This project has two parts that deploy separately:

- **`frontend/`** — a static React/Vite Single Page Application (SPA). Once built (`npm run build`), it is a folder of plain HTML/CSS/JS with no server required. It is uploaded to `public_html`.
- **`backend/`** — a small Node.js/Express API with a SQLite database. It powers the admin panel, the media library, and the Contact/Get Started forms. It runs as a Node.js app inside your hosting control panel, which is available on HostAfrica's shared hosting plans.

> **Which control panel do you have — cPanel or DirectAdmin?** HostAfrica's current shared hosting plans use **DirectAdmin**, not cPanel — check the login screen for your hosting account to see which one you actually have (older/legacy HostAfrica accounts may still be on cPanel). The steps below use cPanel's "Setup Node.js App" naming since that's what this project was originally written against; if you're on DirectAdmin, look for its equivalent **Node.js Selector / Node.js App Manager** tool instead — the underlying steps (create app, set the startup file, set environment variables, run npm install) are the same, just under different menu labels. Ask HostAfrica support if you can't find it.

If your HostAfrica plan does not include Node.js app support, contact HostAfrica support to confirm which plan/tier enables it — it is required for the admin/CMS/leads functionality in this build. The public marketing pages will still work with the built-in static fallback content even without the backend (see "How the site behaves without the backend" below), but the admin panel, live content edits, and form submissions require it.

## 1. Prerequisites on HostAfrica

1. A hosting account with:
   - **File Manager** or FTP access
   - A Node.js app tool (cPanel's "Setup Node.js App", or DirectAdmin's "Node.js Selector" — see the note above)
   - A domain or subdomain pointed at the account (e.g. `veraagritech.com`)
2. Node.js 18+ available in the Node.js app selector (select the newest LTS offered).

## 2. Deploy the backend (API + admin + CMS)

1. **Upload the backend folder.** Upload the entire `backend/` directory to a location *outside* `public_html`, e.g. `/home/<cpanel-user>/vera-backend`. Keeping it outside the web root means it cannot be downloaded directly by visitors.

2. **Create the Node.js app.** In cPanel → Setup Node.js App → Create Application:
   - Node.js version: latest available (18+)
   - Application mode: Production
   - Application root: `vera-backend` (the folder you uploaded)
   - Application URL: choose a subdomain or path, e.g. `api.veraagritech.com`, or a path like `veraagritech.com/api` if your plan supports proxying a path to the Node app (a subdomain is simpler and recommended)
   - Application startup file: `server.js`

3. **Set environment variables.** Copy `.env.example` to `.env` inside the application root (via File Manager or a terminal if your plan includes SSH access), and fill in real values:
   ```
   PORT=<the port your control panel assigns you>
   NODE_ENV=production
   APP_URL=https://api.veraagritech.com
   CORS_ORIGIN=https://veraagritech.com
   JWT_SECRET=<generate a long random string>
   DEFAULT_ADMIN_EMAIL=<a real admin email>
   DEFAULT_ADMIN_PASSWORD=<a strong temporary password>
   DATABASE_URL=file:/home/<cpanel-user>/vera-backend/data/vera.sqlite3
   IMAGE_STORAGE=local
   UPLOADS_DIR=/home/<cpanel-user>/vera-backend/uploads
   ```
   HostAfrica has real persistent disk storage (unlike free-tier hosts such as Render), so `DATABASE_URL` can safely point at a local file and `IMAGE_STORAGE` can stay `local` — both survive restarts and redeploys here. (If you ever move this same codebase to a host with no persistent disk, swap in Turso and Cloudinary instead — see `docs/DEPLOYMENT_RENDER_FREE.md` for that variant.)

   Your control panel's Node.js App interface has its own "Environment Variables" section — prefer entering them there over a plain `.env` file if available, since it keeps secrets out of the file system.

4. **Install dependencies and initialise the database.** cPanel's Node.js App page gives you a "Run NPM Install" button, or a terminal command it shows you (e.g. `source /home/<user>/nodevenv/vera-backend/18/bin/activate && cd /home/<user>/vera-backend`). From that shell:
   ```
   npm install --omit=dev
   npm run setup      # creates the SQLite database, tables, and the default admin account
   ```

5. **Start the app** from the cPanel Node.js App page. Confirm it's running by visiting `https://api.veraagritech.com/api/health` — it should return `{"status":"ok", ...}`.

6. **Change the default admin password immediately.** Log in to `/admin/login` on the live frontend once deployed, using the `DEFAULT_ADMIN_EMAIL`/`DEFAULT_ADMIN_PASSWORD` you set, then use the admin panel to change it (Settings will get a "change password" control in a future iteration — until then, use the `POST /api/auth/change-password` endpoint or ask your developer to rotate it directly in the database).

7. **Back up the SQLite file regularly.** The `DATABASE_URL` file path and `UPLOADS_DIR` are the only stateful data in this system (all leads, applications, page content edits, and uploaded photos live there). Set up a scheduled backup (a cron job, or your control panel's built-in backup tool) to copy these to a backup location weekly at minimum.

## 3. Deploy the frontend (public website)

1. **Point the frontend at the backend.** Before building, edit `frontend/.env`:
   ```
   VITE_API_URL=https://api.veraagritech.com/api
   ```
2. **Build it:**
   ```
   cd frontend
   npm install
   npm run build
   ```
   This produces a `frontend/dist/` folder containing `index.html`, an `assets/` folder, `.htaccess`, `robots.txt`, `sitemap.xml`, and `favicon.svg`.
3. **Upload the contents of `dist/`** (not the folder itself — its *contents*) into `public_html` (or `public_html/` for the domain this site should live on, if it's an addon domain, use that domain's document root instead).
4. **Verify `.htaccess` uploaded.** It's a hidden file — make sure your FTP client or File Manager is set to show hidden files, or it will silently be skipped and client-side routes like `/admin/login` will 404 on refresh.
5. Visit `https://veraagritech.com/` and confirm the homepage, then `https://veraagritech.com/admin/login` to confirm the admin panel loads and can log in.

### Updating the site later

Any time content, pages, or styling change in `frontend/src`, re-run `npm run build` and re-upload the new contents of `dist/` (the file names inside `assets/` change on every build, so it's safest to delete the old `assets/` folder on the server before uploading the new one, or upload everything and then delete anything not referenced by the new `index.html`).

## 4. How the site behaves without the backend

The frontend ships with a complete static copy of all cloned content baked in (`frontend/src/data/content.json`) as a fallback. If the backend is ever unreachable — mid-deployment, a temporary outage, etc. — visitors still see the full site with placeholder images, rather than a blank or broken page. The moment the backend is reachable, live/admin-edited content takes over automatically on the next page load. The Contact and Get Started forms, and the entire `/admin` panel, require the backend to function.

## 5. What "Phase 1" means for the Calculator

Per the product rules agreed for this phase (see the uploaded *Vera Agritech Product Design & Technical Architecture* document, section 23, "Critical Product Rule — No Invented Commercial Claims"), the `/calculator` page intentionally ships in a **"coming soon" / on-hold state**. It shows the planned input fields (greenhouse size, package, crop, contribution, financing period) but does not calculate or publish any ROI, yield, revenue, or payback figures. This is not a bug — it stays this way until Vera AgriTech supplies and approves the underlying production, pricing, and financing assumptions. Once approved, wiring the calculation engine in is a backend-only change (add a `/api/calculator` endpoint using the approved formulas); the frontend form is already built to the approved input/output shape from the architecture document and needs no rework.

## 6. Admin panel — first-time checklist for the Vera AgriTech team

1. Log in at `/admin/login` with the credentials your developer gives you, and change the password immediately.
2. Go to **Media Library** and upload real photos against every placeholder image key (the homepage hero, the founder photo, each crop, each testimonial headshot, both project case studies, etc.). Every placeholder on the live site is clearly labelled "Image placeholder" with the key name it needs.
3. Go to **Page Content** for each page and review/refine the cloned copy — it was carried over verbatim from the previous website, but this is the moment to update anything.
4. Review **Packages**, **Crops**, **FAQs**, **Testimonials**, and **Case Studies** — these came pre-loaded with the same data as the old site and the CityHarvest business model document.
5. Check **Leads Inbox** and **Applications** regularly; both notify nobody automatically in this phase (no email/SMS integration yet) — checking the admin panel is currently the only way to see new enquiries. Email notifications for new leads are a good candidate for the Phase 2 roadmap.
